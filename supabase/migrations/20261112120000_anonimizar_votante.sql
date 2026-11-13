-- Paso 9 de docs/PLAN_INFRAESTRUCTURA.md (aprobado por el dueño el 2026-11-12, opción A):
-- si alguien pide salir, se borran su cuenta, su correo y su nombre. Si ya votó, el voto
-- sigue contando en los totales, pero queda anónimo (sin dueño) y conserva su número.
--
-- Solo el dueño lo hace, desde el SQL Editor de Supabase:
--   select private.anonimizar_votante('correo@ejemplo.com');
-- Nadie puede llamarla desde la web: está en el esquema privado y sin permisos para
-- anon, authenticated ni service_role.
--
-- Opción A: no se guarda nada de la persona, así que podría registrarse y votar otra vez
-- con el mismo correo. El dueño aceptó ese riesgo.

-- 1. El voto puede quedar sin dueño cuando se borra la cuenta.
alter table public.votos alter column usuario_id drop not null;

alter table public.votos drop constraint votos_usuario_id_fkey;
alter table public.votos
  add constraint votos_usuario_id_fkey foreign key (usuario_id)
    references auth.users (id) on delete set null;

-- 2. El voto sigue bloqueado. Única excepción: durante la anonimización de esa misma
-- cuenta, vaciar usuario_id sin cambiar nada más.
create or replace function private.bloquear_voto()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
     and old.usuario_id is not null
     and new.usuario_id is null
     and current_setting('censo.anonimizar', true) = old.usuario_id::text
     and (to_jsonb(new) - 'usuario_id') = (to_jsonb(old) - 'usuario_id') then
    return new;
  end if;

  raise exception 'Un voto emitido no se puede cambiar ni borrar';
end;
$$;

-- 3. El perfil de quien votó sigue protegido. Única excepción: borrarlo durante la
-- anonimización de esa misma cuenta.
create or replace function private.proteger_perfil()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.ha_votado
       and current_setting('censo.anonimizar', true) is distinct from old.id::text then
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

-- 4. La herramienta del dueño. Todo ocurre en una sola transacción: si algo falla,
-- no se cambia nada.
create function private.anonimizar_votante(p_correo text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  v_correo text := lower(trim(p_correo));
  v_id uuid;
  v_numero bigint;
begin
  if v_correo is null or v_correo = '' then
    raise exception 'Escribe el correo de la cuenta';
  end if;

  select u.id into v_id from auth.users u where lower(u.email) = v_correo;
  if v_id is null then
    raise exception 'No existe ninguna cuenta con el correo %', v_correo;
  end if;

  select v.numero_voto into v_numero from public.votos v where v.usuario_id = v_id;

  -- La excepción vale solo para esta cuenta y solo hasta el final de la transacción.
  perform set_config('censo.anonimizar', v_id::text, true);

  -- Borra la cuenta. En cascada se borran su perfil, sus identidades (Google o
  -- correo), sus sesiones y sus códigos; el voto queda sin dueño.
  delete from auth.users where id = v_id;

  -- Restos sin llave foránea que guardan el identificador o el correo.
  delete from auth.refresh_tokens where user_id = v_id::text;
  delete from auth.flow_state where user_id = v_id;
  delete from auth.audit_log_entries
  where strpos(payload::text, v_id::text) > 0
     or strpos(lower(payload::text), v_correo) > 0;

  perform set_config('censo.anonimizar', '', true);

  if v_numero is null then
    return 'Cuenta borrada. No había votado.';
  end if;
  return format('Cuenta borrada. El voto N.º %s sigue contando y ahora es anónimo.', v_numero);
end;
$$;

revoke all on function private.anonimizar_votante(text) from public, anon, authenticated, service_role;
