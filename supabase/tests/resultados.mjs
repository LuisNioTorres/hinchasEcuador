// Pruebas de las vistas de rankings (docs/SUPABASE_SQL.md, Fase 3) contra Supabase LOCAL.
// Se niegan a correr contra otra URL. Crean votos que no se pueden borrar: ejecutar
// `npx supabase db reset` antes y después.
//
// Uso, desde la raíz del proyecto:
//   npx supabase db reset
//   node supabase/tests/resultados.mjs
import { execFileSync } from 'node:child_process';

const estado = execFileSync('npx', ['supabase', 'status', '-o', 'json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});
const { API_URL, ANON_KEY } = JSON.parse(estado);
if (!/^http:\/\/127\.0\.0\.1:/.test(API_URL ?? '')) {
  console.error('ABORTADO: la URL no es local');
  process.exit(2);
}
const sql = (q) =>
  execFileSync(
    'docker',
    ['exec', '-i', 'supabase_db_pagina-hinchas-ecuador', 'psql', '-U', 'postgres', '-d', 'postgres', '-At', '-v', 'ON_ERROR_STOP=1', '-c', q],
    { encoding: 'utf8' },
  ).trim();
const sqlErr = (q) => {
  try {
    sql(q);
    return null;
  } catch (e) {
    return String(e.stderr);
  }
};
const get = async (path, method = 'GET') => {
  const res = await fetch(API_URL + path, { method, headers: { apikey: ANON_KEY } });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text };
};

let total = 0;
let fails = 0;
async function t(name, fn) {
  total++;
  try {
    const d = await fn();
    console.log(`PASA  ${name}${d ? ` (${d})` : ''}`);
  } catch (e) {
    fails++;
    console.log(`FALLA ${name}: ${e.message}`);
  }
}
const eq = (a, b, m = '') => {
  if (a !== b) throw new Error(`${m} ${String(a).slice(0, 300)} != ${String(b).slice(0, 300)}`);
};

const VISTAS = [
  'vista_ranking_nacional',
  'vista_ranking_provincial',
  'vista_lideres_provinciales',
  'vista_ranking_cantonal',
  'vista_ranking_continental',
];

if (sql('select count(*) from public.votos') !== '0') {
  console.error('ABORTADO: ejecuta primero npx supabase db reset');
  process.exit(2);
}

await t('Sin votos, todas las vistas están vacías', () => {
  for (const v of VISTAS) eq(sql(`select count(*) from public.${v}`), '0', v);
});

await t('Desempate alfabético entre clubes empatados', () => {
  const votar = (i, slug) => {
    const id = sql(`insert into auth.users (id, email, email_confirmed_at, aud, role)
      values (gen_random_uuid(), 'empate${i}@prueba.local', now(), 'authenticated', 'authenticated') returning id`).split('\n')[0];
    sql(`insert into public.votos (usuario_id, club_id, continente_id)
      select '${id}', (select id from public.clubes where slug='${slug}'), (select id from public.continentes where nombre='Asia')`);
  };
  votar(1, 'emelec');
  votar(2, 'delfin');
  votar(3, 'barcelona');
  eq(sql(`select string_agg(slug, ',' order by posicion_ranking) from public.vista_ranking_continental where continente='Asia'`), 'barcelona,delfin,emelec');
});

// Cuentas y votos de prueba, repartidos de forma variada.
const N = 6000;
sql(`
  insert into auth.users (id, email, email_confirmed_at, aud, role)
  select gen_random_uuid(), 'r' || g || '@prueba.local', now(), 'authenticated', 'authenticated'
  from generate_series(1, ${N}) g;
  create temp table c as select id, row_number() over (order by slug) n from public.clubes;
  create temp table k as select id, provincia_id, row_number() over (order by id) n from public.cantones;
  create temp table co as select id, row_number() over (order by nombre) n from public.continentes;
  insert into public.votos (usuario_id, club_id, provincia_id, canton_id, continente_id)
  select u.id,
    (select id from c where n = 1 + (u.rn * u.rn % 95)),
    case when u.rn % 5 = 0 then null else (select provincia_id from k where n = 1 + (u.rn % 222)) end,
    case when u.rn % 5 = 0 then null else (select id from k where n = 1 + (u.rn % 222)) end,
    case when u.rn % 5 = 0 then (select id from co where n = 1 + (u.rn % 7)) else null end
  from (select id, row_number() over (order by email) rn from auth.users where email ~ '^r[0-9]+@prueba.local') u;
`);
await t('Se cargaron los votos de prueba', () => eq(sql('select count(*) from public.votos'), String(N + 3)));

const comparar = (vista, clave, filtro) => {
  const v = sql(`select ${clave}, club_id, total_votos from public.${vista} order by 1, 2`);
  const b = sql(`select ${clave}, club_id, count(*) from public.votos where ${filtro} group by ${clave}, club_id order by 1, 2`);
  eq(v, b, vista);
  return `${v.split('\n').length} filas`;
};
await t('Nacional: totales iguales a contar los votos con provincia', () => {
  const v = sql(`select club_id, total_votos from public.vista_ranking_nacional order by 1`);
  const b = sql(`select club_id, count(*) from public.votos where provincia_id is not null group by 1 order by 1`);
  eq(v, b);
});
await t('Nacional: no incluye votos del exterior', () =>
  eq(sql(`select sum(total_votos) from public.vista_ranking_nacional`), sql(`select count(*) from public.votos where provincia_id is not null`)));
await t('Provincial: totales correctos', () => comparar('vista_ranking_provincial', 'provincia_id', 'provincia_id is not null'));
await t('Cantonal: totales correctos', () => comparar('vista_ranking_cantonal', 'canton_id', 'canton_id is not null'));
await t('Continental: totales correctos', () => comparar('vista_ranking_continental', 'continente_id', 'continente_id is not null'));
await t('La suma de los continentes es el total del exterior', () =>
  eq(sql(`select sum(total_votos) from public.vista_ranking_continental`), sql(`select count(*) from public.votos where continente_id is not null`)));
await t('La vista cantonal supera las 1000 filas (obliga a leer por páginas)', () => {
  const n = Number(sql(`select count(*) from public.vista_ranking_cantonal`));
  if (n <= 1000) throw new Error(String(n));
  return `${n} filas`;
});

for (const [v, col, part] of [
  ['vista_ranking_nacional', 'porcentaje_nacional', `'x'`],
  ['vista_ranking_provincial', 'porcentaje_provincial', 'provincia_id'],
  ['vista_ranking_cantonal', 'porcentaje_cantonal', 'canton_id'],
  ['vista_ranking_continental', 'porcentaje_continental', 'continente_id'],
]) {
  await t(`${v}: los porcentajes suman 100`, () => {
    const malos = sql(`select count(*) from (select ${part}, sum(${col}) s from public.${v} group by 1) t where abs(s - 100) > 1`);
    eq(malos, '0');
  });
  await t(`${v}: posiciones 1..n ordenadas por votos, sin repetir`, () => {
    const malos = sql(`select count(*) from (
      select posicion_ranking, row_number() over (partition by ${part} order by total_votos desc, nombre_popular collate "es-x-icu") r
      from public.${v}) t where posicion_ranking <> r`);
    eq(malos, '0');
  });
}
await t('Líderes: una fila por provincia y es la posición 1', () => {
  eq(sql(`select count(*) from (select provincia_id from public.vista_lideres_provinciales group by 1 having count(*) > 1) t`), '0');
  eq(
    sql(`select provincia_id, club_id, total_votos from public.vista_lideres_provinciales order by 1`),
    sql(`select provincia_id, club_id, total_votos from public.vista_ranking_provincial where posicion_ranking = 1 order by 1`),
  );
});

await t('El orden de la base coincide con el de la página (con tildes)', () => {
  const filas = sql(`select nombre_popular || '|' || total_votos from public.vista_ranking_provincial order by provincia_id, posicion_ranking`);
  const porProvincia = sql(`select provincia_id || '|' || nombre_popular || '|' || total_votos from public.vista_ranking_provincial order by provincia_id, posicion_ranking`).split('\n').map((l) => l.split('|'));
  const grupos = Map.groupBy(porProvincia, (f) => f[0]);
  for (const [, g] of grupos) {
    const orden = [...g].sort((x, y) => Number(y[2]) - Number(x[2]) || x[1].localeCompare(y[1], 'es'));
    eq(orden.map((f) => f[1]).join(), g.map((f) => f[1]).join());
  }
  return `${filas.split('\n').length} filas`;
});

await t('Un voto nuevo se refleja al instante en las vistas', () => {
  const antes = Number(sql(`select coalesce(sum(total_votos),0) from public.vista_ranking_nacional`));
  const id = sql(`insert into auth.users (id, email, email_confirmed_at, aud, role)
    values (gen_random_uuid(), 'nuevo@prueba.local', now(), 'authenticated', 'authenticated') returning id`).split('\n')[0];
  sql(`insert into public.votos (usuario_id, club_id, provincia_id, canton_id)
    select '${id}', (select id from public.clubes where slug='barcelona'), c.provincia_id, c.id
    from public.cantones c limit 1`);
  eq(Number(sql(`select sum(total_votos) from public.vista_ranking_nacional`)), antes + 1);
});

for (const v of VISTAS) {
  await t(`${v}: un visitante la lee`, async () => {
    const r = await get(`/rest/v1/${v}?select=*&limit=1`);
    eq(r.status, 200, r.text);
    eq(r.json.length, 1);
  });
  await t(`${v}: no expone votantes`, () => {
    const cols = sql(`select string_agg(column_name, ',') from information_schema.columns where table_schema='public' and table_name='${v}'`);
    if (/usuario|email|numero_voto|nombre_completo/.test(cols)) throw new Error(cols);
  });
  await t(`${v}: nadie puede escribir en ella`, async () => {
    const r = await get(`/rest/v1/${v}`, 'DELETE');
    if (r.status < 400) throw new Error(`HTTP ${r.status}`);
    const p = sql(`select string_agg(grantee||':'||privilege_type, ',' order by grantee) from information_schema.role_table_grants where table_schema='public' and table_name='${v}' and grantee in ('anon','authenticated','service_role','PUBLIC')`);
    eq(p, 'anon:SELECT,authenticated:SELECT');
  });
}
await t('La tabla votos sigue cerrada al público', async () => {
  const r = await get('/rest/v1/votos?select=*&limit=1');
  if (r.status !== 401 && r.status !== 403) throw new Error(`HTTP ${r.status}: ${r.text}`);
});
await t('Las vistas no permiten saltarse el bloqueo del voto', () => {
  const e = sqlErr(`delete from public.votos where true`);
  if (!e?.includes('no se puede cambiar')) throw new Error(String(e));
});

console.log(`\nTOTAL: ${total} pruebas, ${total - fails} pasan, ${fails} fallan`);
process.exit(fails ? 1 : 0);
