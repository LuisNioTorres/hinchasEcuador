-- Corrige dos hallazgos de la revisión del proyecto real (docs/SUPABASE_SQL.md, Fase 4).

-- La clave secreta del servidor no necesita ningún permiso en los catálogos.
revoke all on public.continentes, public.provincias, public.cantones, public.clubes
  from service_role;

-- Función de Automatic RLS: solo existe en el proyecto real, no en el entorno local.
-- El sistema la dispara al crear una tabla, sin necesitar este permiso.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable()
      from public, anon, authenticated, service_role;
  end if;
end;
$$;
