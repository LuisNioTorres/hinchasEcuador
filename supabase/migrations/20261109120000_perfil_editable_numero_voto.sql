-- Decisiones 14 a 16 de docs/SUPABASE_SQL.md, y bloqueo del cambio de correo (riesgo de la fase Login).

-- 1. Nombre y apellido separados.
alter table public.profiles
  add column nombre varchar(70),
  add column apellido varchar(70);

update public.profiles
set
  nombre = left(substring(trim(nombre_completo) from '^\S+'), 70),
  apellido = left(nullif(trim(substring(trim(nombre_completo) from '^\S+\s+(.*)$')), ''), 70)
where nombre_completo is not null;

drop policy "Usuario corrige su nombre antes de votar" on public.profiles;
alter table public.profiles drop column nombre_completo;

-- 2. Nombre y apellido editables siempre, también después de votar.
grant update (nombre, apellido) on public.profiles to authenticated;

create policy "Usuario edita su nombre" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function private.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  completo text := nullif(trim(coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name'
  )), '');
begin
  insert into public.profiles (id, email, nombre, apellido)
  values (
    new.id,
    new.email,
    left(coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'given_name'), ''),
      substring(completo from '^\S+')
    ), 70),
    left(coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'family_name'), ''),
      nullif(trim(substring(completo from '^\S+\s+(.*)$')), '')
    ), 70)
  );
  return new;
end;
$$;

-- El voto ya no bloquea el nombre. El resto del perfil sigue protegido.
create or replace function private.proteger_perfil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.ha_votado then
      raise exception 'El perfil está bloqueado porque el usuario ya votó';
    end if;
    return old;
  end if;

  if new.id is distinct from old.id or new.email is distinct from old.email then
    raise exception 'El identificador y el correo del perfil no se pueden cambiar';
  end if;

  -- Profundidad 2: el cambio viene del trigger que registra el voto.
  if new.ha_votado is distinct from old.ha_votado and pg_trigger_depth() < 2 then
    raise exception 'ha_votado solo lo puede cambiar el sistema';
  end if;

  return new;
end;
$$;

-- 3. ID DEL HINCHA: el número de orden del voto.
alter table public.votos add column numero_voto bigint;

-- Solo actúa si ya hubiera votos; el bloqueo vuelve a activarse enseguida.
alter table public.votos disable trigger bloquear_cambio_voto;
update public.votos v
set numero_voto = o.n
from (select id, row_number() over (order by created_at, id) as n from public.votos) o
where o.id = v.id;
alter table public.votos enable trigger bloquear_cambio_voto;

alter table public.votos
  alter column numero_voto set not null,
  add constraint votos_numero_voto_key unique (numero_voto),
  add constraint votos_numero_voto_positivo check (numero_voto > 0);

-- El número se calcula bajo un bloqueo que dura hasta el final de la transacción.
-- Un voto rechazado se revierte sin consumir número, y los votos no se pueden borrar.
create or replace function private.validar_voto()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from auth.users
    where id = new.usuario_id and email_confirmed_at is not null
  ) then
    raise exception 'La cuenta no tiene el correo verificado';
  end if;

  perform pg_advisory_xact_lock(hashtext('public.votos.numero_voto'));
  select coalesce(max(numero_voto), 0) + 1 into new.numero_voto from public.votos;

  new.created_at := now();
  return new;
end;
$$;

-- 4. El usuario consulta únicamente su propio voto. votos sigue sin políticas.
create function public.mi_voto()
returns table (
  numero_voto bigint,
  club_slug varchar,
  provincia text,
  continente text
)
language sql
stable
security definer
set search_path = ''
as $$
  select v.numero_voto, c.slug, p.nombre, co.nombre
  from public.votos v
  join public.clubes c on c.id = v.club_id
  left join public.provincias p on p.id = v.provincia_id
  left join public.continentes co on co.id = v.continente_id
  where v.usuario_id = (select auth.uid());
$$;

revoke all on function public.mi_voto() from public, anon, service_role;
grant execute on function public.mi_voto() to authenticated;

-- 5. El correo de una cuenta no se puede cambiar: impide liberar el correo para votar otra vez.
create function private.bloquear_cambio_correo()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.email is not null and new.email is distinct from old.email then
    raise exception 'El correo de la cuenta no se puede cambiar';
  end if;
  return new;
end;
$$;

create trigger bloquear_cambio_correo
  before update of email on auth.users
  for each row execute function private.bloquear_cambio_correo();
