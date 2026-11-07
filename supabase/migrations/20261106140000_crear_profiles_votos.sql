-- Fase 2: usuarios y votos (docs/DATOS_INFORMATION.md y docs/SUPABASE_SQL.md).

-- Las funciones de los triggers quedan fuera del esquema público expuesto por la API.
create schema private;
revoke all on schema private from public, anon, authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email varchar(255) not null unique,
  nombre_completo varchar(150),
  ha_votado boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.votos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null unique references auth.users (id) on delete restrict,
  club_id uuid not null references public.clubes (id) on delete restrict,
  continente_id uuid references public.continentes (id) on delete restrict,
  provincia_id uuid references public.provincias (id) on delete restrict,
  canton_id uuid,
  created_at timestamptz not null default now(),
  constraint check_ubicacion_valida check (
    (continente_id is not null and provincia_id is null and canton_id is null)
    or (continente_id is null and provincia_id is not null and canton_id is not null)
  ),
  -- Rechaza un cantón que no pertenezca a la provincia elegida.
  constraint votos_canton_provincia_fkey foreign key (canton_id, provincia_id)
    references public.cantones (id, provincia_id) on delete restrict
);

create index votos_club_id_idx on public.votos (club_id);
create index votos_provincia_club_idx on public.votos (provincia_id, club_id);
create index votos_canton_club_idx on public.votos (canton_id, club_id);
create index votos_continente_club_idx on public.votos (continente_id, club_id);

-- Permisos. Las tablas nuevas reciben por defecto TRUNCATE, REFERENCES, TRIGGER y MAINTAIN.
alter table public.profiles enable row level security;
alter table public.votos enable row level security;

revoke all on public.profiles, public.votos from anon, authenticated, service_role;

grant select on public.profiles to authenticated;
grant update (nombre_completo) on public.profiles to authenticated;

-- El servidor registra el voto con la clave secreta; no puede leerlo, cambiarlo ni borrarlo.
grant insert on public.votos to service_role;

create policy "Usuario lee su propio perfil" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "Usuario corrige su nombre antes de votar" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id and ha_votado = false)
  with check ((select auth.uid()) = id and ha_votado = false);

-- votos no tiene políticas a propósito: queda cerrada a cualquier acceso de los roles públicos.

-- Perfil automático al crear una cuenta.
create function private.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, nombre_completo)
  values (
    new.id,
    new.email,
    left(
      nullif(
        trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')),
        ''
      ),
      150
    )
  );
  return new;
end;
$$;

create trigger crear_perfil_al_registrarse
  after insert on auth.users
  for each row execute function private.crear_perfil();

-- Perfil bloqueado al votar, y ha_votado controlado solo por el sistema.
create function private.proteger_perfil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.ha_votado then
    raise exception 'El perfil está bloqueado porque el usuario ya votó';
  end if;

  -- Profundidad 2: el cambio viene del trigger que registra el voto.
  if tg_op = 'UPDATE' and new.ha_votado is distinct from old.ha_votado
     and pg_trigger_depth() < 2 then
    raise exception 'ha_votado solo lo puede cambiar el sistema';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger proteger_perfil
  before update or delete on public.profiles
  for each row execute function private.proteger_perfil();

-- Solo vota una cuenta con correo verificado, y la fecha la pone la base de datos.
create function private.validar_voto()
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

  new.created_at := now();
  return new;
end;
$$;

create trigger validar_voto
  before insert on public.votos
  for each row execute function private.validar_voto();

-- ha_votado se activa en la misma operación que el voto.
create function private.marcar_ha_votado()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set ha_votado = true where id = new.usuario_id;

  if not found then
    raise exception 'La cuenta no tiene perfil';
  end if;

  return new;
end;
$$;

create trigger marcar_ha_votado
  after insert on public.votos
  for each row execute function private.marcar_ha_votado();

-- Bloqueo real: rige también para la clave secreta, que salta RLS.
create function private.bloquear_voto()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'Un voto emitido no se puede cambiar ni borrar';
end;
$$;

create trigger bloquear_cambio_voto
  before update or delete on public.votos
  for each row execute function private.bloquear_voto();

create trigger bloquear_vaciado_votos
  before truncate on public.votos
  for each statement execute function private.bloquear_voto();
