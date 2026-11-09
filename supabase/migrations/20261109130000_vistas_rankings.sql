-- Fase 3: vistas de rankings (docs/DATOS_INFORMATION.md, Módulo 5).
--
-- Excepción consciente ante el asesor de Supabase: las vistas se ejecutan con los
-- permisos de su dueño para poder contar `votos`, que sigue cerrada al público.
-- Solo entregan totales: ninguna expone usuario_id ni numero_voto.
-- Un club sin votos no aparece. El desempate es alfabético con reglas del español.

create view public.vista_ranking_nacional as
with totales as (
  select club_id, count(*) as total_votos
  from public.votos
  where provincia_id is not null
  group by club_id
)
select
  t.club_id,
  c.slug,
  c.nombre_popular,
  c.color_hex,
  c.escudo_url,
  t.total_votos,
  round(t.total_votos * 100.0 / sum(t.total_votos) over (), 2) as porcentaje_nacional,
  row_number() over (
    order by t.total_votos desc, c.nombre_popular collate "es-x-icu"
  ) as posicion_ranking
from totales t
join public.clubes c on c.id = t.club_id;

create view public.vista_ranking_provincial as
with totales as (
  select provincia_id, club_id, count(*) as total_votos
  from public.votos
  where provincia_id is not null
  group by provincia_id, club_id
)
select
  t.provincia_id,
  p.codigo_iso,
  p.nombre as provincia,
  t.club_id,
  c.slug,
  c.nombre_popular,
  c.color_hex,
  c.escudo_url,
  t.total_votos,
  round(t.total_votos * 100.0 / sum(t.total_votos) over (partition by t.provincia_id), 2)
    as porcentaje_provincial,
  row_number() over (
    partition by t.provincia_id
    order by t.total_votos desc, c.nombre_popular collate "es-x-icu"
  ) as posicion_ranking
from totales t
join public.clubes c on c.id = t.club_id
join public.provincias p on p.id = t.provincia_id;

create view public.vista_lideres_provinciales as
select
  provincia_id,
  codigo_iso,
  provincia,
  club_id,
  slug,
  nombre_popular,
  color_hex,
  escudo_url,
  total_votos,
  porcentaje_provincial as porcentaje_dominio
from public.vista_ranking_provincial
where posicion_ranking = 1;

create view public.vista_ranking_cantonal as
with totales as (
  select canton_id, provincia_id, club_id, count(*) as total_votos
  from public.votos
  where canton_id is not null
  group by canton_id, provincia_id, club_id
)
select
  t.canton_id,
  ca.nombre as canton,
  t.provincia_id,
  p.codigo_iso,
  t.club_id,
  c.slug,
  c.nombre_popular,
  c.color_hex,
  c.escudo_url,
  t.total_votos,
  round(t.total_votos * 100.0 / sum(t.total_votos) over (partition by t.canton_id), 2)
    as porcentaje_cantonal,
  row_number() over (
    partition by t.canton_id
    order by t.total_votos desc, c.nombre_popular collate "es-x-icu"
  ) as posicion_ranking
from totales t
join public.clubes c on c.id = t.club_id
join public.cantones ca on ca.id = t.canton_id
join public.provincias p on p.id = t.provincia_id;

create view public.vista_ranking_continental as
with totales as (
  select continente_id, club_id, count(*) as total_votos
  from public.votos
  where continente_id is not null
  group by continente_id, club_id
)
select
  t.continente_id,
  co.nombre as continente,
  t.club_id,
  c.slug,
  c.nombre_popular,
  c.color_hex,
  c.escudo_url,
  t.total_votos,
  round(t.total_votos * 100.0 / sum(t.total_votos) over (partition by t.continente_id), 2)
    as porcentaje_continental,
  row_number() over (
    partition by t.continente_id
    order by t.total_votos desc, c.nombre_popular collate "es-x-icu"
  ) as posicion_ranking
from totales t
join public.clubes c on c.id = t.club_id
join public.continentes co on co.id = t.continente_id;

-- Lectura pública y nada más.
revoke all on
  public.vista_ranking_nacional,
  public.vista_ranking_provincial,
  public.vista_lideres_provinciales,
  public.vista_ranking_cantonal,
  public.vista_ranking_continental
from public, anon, authenticated, service_role;

grant select on
  public.vista_ranking_nacional,
  public.vista_ranking_provincial,
  public.vista_lideres_provinciales,
  public.vista_ranking_cantonal,
  public.vista_ranking_continental
to anon, authenticated;
