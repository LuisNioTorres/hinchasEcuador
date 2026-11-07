-- Fase 1: catálogos públicos de solo lectura (docs/DATOS_INFORMATION.md y docs/SUPABASE_SQL.md).

create table public.continentes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique
);

create table public.provincias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  codigo_iso text unique
);

create table public.cantones (
  id uuid primary key default gen_random_uuid(),
  provincia_id uuid not null references public.provincias (id) on delete restrict,
  nombre text not null,
  unique (provincia_id, nombre),
  -- Permite que votos valide en la Fase 2 que el cantón pertenece a la provincia.
  unique (id, provincia_id)
);

create table public.clubes (
  id uuid primary key default gen_random_uuid(),
  slug varchar(50) not null unique,
  nombre_oficial varchar(150) not null,
  nombre_popular varchar(100) not null unique,
  color_hex varchar(7) not null check (color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  escudo_url varchar(255) not null,
  provincia_id uuid references public.provincias (id) on delete restrict,
  created_at timestamptz default now()
);

create index clubes_provincia_id_idx on public.clubes (provincia_id);

alter table public.continentes enable row level security;
alter table public.provincias enable row level security;
alter table public.cantones enable row level security;
alter table public.clubes enable row level security;

-- Las tablas nuevas reciben por defecto TRUNCATE, REFERENCES, TRIGGER y MAINTAIN: se quitan
-- y el público queda solo con lectura.
revoke all on public.continentes, public.provincias, public.cantones, public.clubes
  from anon, authenticated;
grant select on public.continentes, public.provincias, public.cantones, public.clubes
  to anon, authenticated;

create policy "Lectura pública de continentes" on public.continentes
  for select to anon, authenticated using (true);
create policy "Lectura pública de provincias" on public.provincias
  for select to anon, authenticated using (true);
create policy "Lectura pública de cantones" on public.cantones
  for select to anon, authenticated using (true);
create policy "Lectura pública de clubes" on public.clubes
  for select to anon, authenticated using (true);
