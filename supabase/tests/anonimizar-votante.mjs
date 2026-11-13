// Pruebas de private.anonimizar_votante (paso 9 de docs/PLAN_INFRAESTRUCTURA.md) contra
// Supabase LOCAL en Docker. Se niegan a correr contra otra URL y exigen una base sin votos.
//
// Uso, desde la raíz del proyecto:
//   npx supabase start
//   npx supabase db reset
//   node supabase/tests/anonimizar-votante.mjs
//
// Los votos no se pueden borrar, así que hay que ejecutar `db reset` antes de cada corrida.
import { execFileSync } from 'node:child_process';

const estado = execFileSync('npx', ['supabase', 'status', '-o', 'json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});
const { API_URL, ANON_KEY, SERVICE_ROLE_KEY } = JSON.parse(estado);
if (!/^http:\/\/127\.0\.0\.1:/.test(API_URL ?? '')) {
  console.error('ABORTADO: la URL no es local');
  process.exit(2);
}
const CONTAINER = 'supabase_db_pagina-hinchas-ecuador';
const run = Date.now();
const results = [];
let group = '';

// postgres es el rol del SQL Editor de Supabase: el mismo que usará el dueño.
const sql = (q, user = 'postgres') =>
  execFileSync(
    'docker',
    ['exec', '-i', CONTAINER, 'psql', '-U', user, '-d', 'postgres', '-At', '-v', 'ON_ERROR_STOP=1', '-c', q],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  ).trim();
const sqlErr = (q, user = 'postgres') => {
  try {
    sql(q, user);
    return null;
  } catch (e) {
    return String(e.stderr);
  }
};

async function http(path, { method = 'GET', key = ANON_KEY, token, body } = {}) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      apikey: key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text };
}
const service = (path, o = {}) => http(path, { key: SERVICE_ROLE_KEY, token: SERVICE_ROLE_KEY, ...o });

async function t(name, fn) {
  try {
    const detail = await fn();
    results.push({ group, name, ok: true, detail });
  } catch (e) {
    results.push({ group, name, ok: false, detail: e.message });
  }
}
function must(cond, msg) {
  if (!cond) throw new Error(msg);
}
const brief = (r) => `HTTP ${r.status} ${r.json?.code ?? ''} ${(r.json?.message ?? r.json?.msg ?? r.text ?? '').slice(0, 110)}`;

async function user(tag, { meta, email } = {}) {
  email ??= `${tag}.${run}@prueba.local`;
  const password = `Clave-${run}-x!`;
  const r = await service('/auth/v1/admin/users', {
    method: 'POST',
    body: { email, password, email_confirm: true, user_metadata: meta ?? {} },
  });
  must(r.status === 200, `crear usuario ${tag}: ${brief(r)}`);
  const s = await http('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
  must(s.status === 200, `iniciar sesión ${tag}: ${brief(s)}`);
  return { id: r.json.id, email, token: s.json.access_token, refresh: s.json.refresh_token };
}
const votar = (body) => service('/rest/v1/votos', { method: 'POST', body });
const anonimizar = (correo) => sql(`select private.anonimizar_votante(${correo === null ? 'null' : `'${correo}'`})`);
const fila = (where) =>
  sql(`select numero_voto, club_id, coalesce(provincia_id::text,'-'), coalesce(canton_id::text,'-'),
       coalesce(continente_id::text,'-'), created_at, coalesce(usuario_id::text,'<sin dueño>')
       from public.votos where ${where}`);
const rastros = (u) => ({
  users: sql(`select count(*) from auth.users where id='${u.id}' or lower(email)=lower('${u.email}')`),
  identities: sql(`select count(*) from auth.identities where user_id='${u.id}' or lower(email)=lower('${u.email}')`),
  sessions: sql(`select count(*) from auth.sessions where user_id='${u.id}'`),
  refresh: sql(`select count(*) from auth.refresh_tokens where user_id='${u.id}'`),
  otp: sql(`select count(*) from auth.one_time_tokens where user_id='${u.id}'`),
  flow: sql(`select count(*) from auth.flow_state where user_id='${u.id}'`),
  audit: sql(`select count(*) from auth.audit_log_entries where strpos(payload::text,'${u.id}')>0 or strpos(lower(payload::text),lower('${u.email}'))>0`),
  profile: sql(`select count(*) from public.profiles where id='${u.id}' or lower(email)=lower('${u.email}')`),
  votos: sql(`select count(*) from public.votos where usuario_id='${u.id}'`),
});
const ranking = () => sql('select club_id, total_votos from public.vista_ranking_nacional order by 1');
const totales = () => sql(`select
  (select coalesce(sum(total_votos),0) from public.vista_ranking_nacional),
  (select coalesce(sum(total_votos),0) from public.vista_ranking_provincial),
  (select coalesce(sum(total_votos),0) from public.vista_ranking_cantonal),
  (select coalesce(sum(total_votos),0) from public.vista_ranking_continental)`);

if (sql('select count(*) from public.votos') !== '0') {
  console.error('ABORTADO: la base local ya tiene votos. Ejecuta primero: npx supabase db reset');
  process.exit(2);
}

// Catálogos de referencia
const provA = sql(`select id from public.provincias order by nombre limit 1`);
const cantonA = sql(`select id from public.cantones where provincia_id='${provA}' limit 1`);
const [clubA, clubB] = sql(`select id from public.clubes order by nombre_oficial limit 2`).split('\n');
const continente = sql(`select id from public.continentes limit 1`);
const enProv = { provincia_id: provA, canton_id: cantonA };

// Escenario: cuatro personas votan y una no vota.
const juan = await user('juan', { meta: { full_name: 'Juan Pérez' } });
const ana = await user('ana', { meta: { full_name: 'Ana Exterior' } });
const testigo = await user('testigo', { meta: { full_name: 'Testigo Uno' } });
const otro = await user('otro', { meta: { full_name: 'Otro Votante' } });
const sinVoto = await user('sinvoto', { meta: { full_name: 'Sin Voto' } });
// Una identidad de Google, como la crea Supabase al entrar con Google.
sql(`insert into auth.identities (provider_id, user_id, identity_data, provider)
     values ('google-${run}', '${juan.id}', jsonb_build_object('sub','google-${run}','email','${juan.email}','full_name','Juan Pérez'), 'google')`);
// Un inicio de sesión con Google a medio terminar (flow_state), sin llave foránea.
sql(`insert into auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, authentication_method)
     values (gen_random_uuid(), '${juan.id}', 'x', 's256', 'x', 'google', 'oauth')`);

for (const [u, club, lugar] of [
  [juan, clubA, enProv],
  [ana, clubB, { continente_id: continente }],
  [testigo, clubA, enProv],
  [otro, clubB, enProv],
]) {
  const r = await votar({ usuario_id: u.id, club_id: club, ...lugar });
  must(r.status === 201, `votar ${u.email}: ${brief(r)}`);
}

group = 'Antes de anonimizar';
const antesJuan = rastros(juan);
await t('Juan tiene cuenta, identidades (correo y Google), sesión, perfil, auditoría y voto', () => {
  must(antesJuan.users === '1' && antesJuan.identities === '2' && antesJuan.sessions !== '0', JSON.stringify(antesJuan));
  must(antesJuan.refresh !== '0' && antesJuan.flow === '1' && antesJuan.audit !== '0', JSON.stringify(antesJuan));
  must(antesJuan.profile === '1' && antesJuan.votos === '1', JSON.stringify(antesJuan));
  return JSON.stringify(antesJuan);
});
const rankingAntes = ranking();
const totalesAntes = totales();
const votoJuanAntes = fila(`usuario_id='${juan.id}'`);
const votoAnaAntes = fila(`usuario_id='${ana.id}'`);
const numeroJuan = votoJuanAntes.split('|')[0];
const numeroAna = votoAnaAntes.split('|')[0];

group = 'Anonimizar a quien votó en una provincia';
let respuesta = '';
await t('La función responde con el número del voto', () => {
  respuesta = anonimizar(juan.email);
  must(respuesta === `Cuenta borrada. El voto N.º ${numeroJuan} sigue contando y ahora es anónimo.`, respuesta);
  return respuesta;
});
await t('No queda ningún dato de Juan en ninguna tabla', () => {
  const r = rastros(juan);
  must(Object.values(r).every((n) => n === '0'), JSON.stringify(r));
  return JSON.stringify(r);
});
await t('El nombre "Juan Pérez" no aparece en ninguna tabla de cuentas', () => {
  const n = sql(`select
    (select count(*) from auth.users where raw_user_meta_data::text ilike '%Juan Pérez%') +
    (select count(*) from auth.identities where identity_data::text ilike '%Juan Pérez%') +
    (select count(*) from public.profiles where nombre ilike 'Juan' and apellido ilike 'Pérez')`);
  must(n === '0', n);
});
await t('El voto sigue igual (número, club, provincia, cantón y fecha), ahora sin dueño', () => {
  const despues = fila(`numero_voto=${numeroJuan}`);
  const esperado = votoJuanAntes.replace(juan.id, '<sin dueño>');
  must(despues === esperado, `antes ${votoJuanAntes} / después ${despues}`);
  return despues.replace(/\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|/, '|…|');
});
await t('Los resultados no cambian (nacional, provincial, cantonal y continental)', () => {
  must(ranking() === rankingAntes, `${rankingAntes} -> ${ranking()}`);
  must(totales() === totalesAntes, `${totalesAntes} -> ${totales()}`);
  return `totales ${totales()}`;
});
await t('Los demás votantes no se tocan', () => {
  must(rastros(testigo).users === '1' && rastros(testigo).profile === '1' && rastros(testigo).votos === '1', 'testigo cambió');
  must(fila(`usuario_id='${ana.id}'`) === votoAnaAntes, 'Ana cambió');
});

group = 'La sesión que Juan tenía abierta';
await t('Su sesión ya no se puede renovar', async () => {
  const r = await http('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: juan.refresh } });
  must(r.status >= 400, brief(r));
  return brief(r);
});
await t('Con su pase anterior no ve perfil ni voto', async () => {
  const p = await http(`/rest/v1/profiles?select=*`, { token: juan.token });
  const v = await http('/rest/v1/rpc/mi_voto', { method: 'POST', token: juan.token, body: {} });
  must(p.status === 200 && Array.isArray(p.json) && p.json.length === 0, brief(p));
  must(v.status === 200 && Array.isArray(v.json) && v.json.length === 0, brief(v));
});
await t('El servidor no puede registrar otro voto a nombre de la cuenta borrada', async () => {
  const r = await votar({ usuario_id: juan.id, club_id: clubA, ...enProv });
  must(r.status >= 400, brief(r));
  return brief(r);
});

group = 'Anonimizar a quien votó desde el exterior';
await t('Correo con mayúsculas y espacios funciona', () => {
  const r = anonimizar(`  ${ana.email.toUpperCase()}  `);
  must(r === `Cuenta borrada. El voto N.º ${numeroAna} sigue contando y ahora es anónimo.`, r);
  const despues = fila(`numero_voto=${numeroAna}`);
  must(despues === votoAnaAntes.replace(ana.id, '<sin dueño>'), despues);
  must(Object.values(rastros(ana)).every((n) => n === '0'), JSON.stringify(rastros(ana)));
});
await t('Dos votos anónimos conviven sin conflicto y los totales siguen iguales', () => {
  must(sql('select count(*) from public.votos where usuario_id is null') === '2', 'no son 2');
  must(totales() === totalesAntes && ranking() === rankingAntes, 'cambiaron');
});

group = 'Quien no votó';
await t('Se borra la cuenta entera', () => {
  const r = anonimizar(sinVoto.email);
  must(r === 'Cuenta borrada. No había votado.', r);
  must(Object.values(rastros(sinVoto)).every((n) => n === '0'), JSON.stringify(rastros(sinVoto)));
  must(totales() === totalesAntes, 'cambiaron los totales');
  return r;
});

group = 'Errores';
const fotoBase = () => sql('select (select count(*) from auth.users)||\'/\'||(select count(*) from public.profiles)||\'/\'||(select count(*) from public.votos)||\'/\'||(select count(*) from public.votos where usuario_id is null)');
const base = fotoBase();
for (const [nombreCaso, correo, texto] of [
  ['Correo que no existe', 'nadie@prueba.local', 'No existe ninguna cuenta'],
  ['Correo ya anonimizado (repetir la orden)', juan.email, 'No existe ninguna cuenta'],
  ['Correo vacío', '   ', 'Escribe el correo'],
  ['Sin correo (null)', null, 'Escribe el correo'],
]) {
  await t(`${nombreCaso}: da error y no cambia nada`, () => {
    const e = sqlErr(`select private.anonimizar_votante(${correo === null ? 'null' : `'${correo}'`})`);
    must(e?.includes(texto), `error: ${e}`);
    must(fotoBase() === base, `${base} -> ${fotoBase()}`);
    return e.split('\n')[0];
  });
}
await t('Comodines de SQL en el correo no borran a otros (%)', () => {
  const e = sqlErr(`select private.anonimizar_votante('%')`);
  must(e?.includes('No existe ninguna cuenta') && fotoBase() === base, `error: ${e}`);
});
await t('Si la operación se cancela, no se borra nada', () => {
  sql(`begin; select private.anonimizar_votante('${testigo.email}'); rollback;`);
  must(rastros(testigo).users === '1' && rastros(testigo).profile === '1' && rastros(testigo).votos === '1', 'se borró');
  must(fotoBase() === base, `${base} -> ${fotoBase()}`);
});

group = 'Las protecciones de siempre siguen activas';
await t('Borrar por Auth (como el panel) a alguien que votó: rechazado', async () => {
  const r = await service(`/auth/v1/admin/users/${testigo.id}`, { method: 'DELETE' });
  must(r.status >= 400, brief(r));
  must(rastros(testigo).users === '1' && rastros(testigo).votos === '1', 'se borró');
  return brief(r);
});
await t('Borrar por SQL directo a alguien que votó: rechazado', () => {
  const e = sqlErr(`delete from auth.users where id='${testigo.id}'`);
  must(e !== null, 'se borró');
  must(rastros(testigo).users === '1' && rastros(testigo).votos === '1', 'se borró');
  return e.split('\n')[0];
});
await t('Borrar su perfil por SQL directo: rechazado', () => {
  const e = sqlErr(`delete from public.profiles where id='${testigo.id}'`);
  must(e?.includes('bloqueado'), `error: ${e}`);
});
await t('Cambiar, borrar o vaciar votos (también los anónimos): rechazado', () => {
  for (const q of [
    `update public.votos set club_id='${clubB}' where usuario_id='${testigo.id}'`,
    `delete from public.votos where usuario_id='${testigo.id}'`,
    `update public.votos set usuario_id=null where usuario_id='${testigo.id}'`,
    `update public.votos set usuario_id='${testigo.id}' where numero_voto=${numeroJuan}`,
    `update public.votos set club_id='${clubB}' where numero_voto=${numeroJuan}`,
    `delete from public.votos where usuario_id is null`,
    `truncate public.votos`,
  ]) {
    const e = sqlErr(q);
    must(e?.includes('no se puede cambiar ni borrar'), `${q} -> ${e}`);
  }
  must(totales() === totalesAntes, 'cambiaron los totales');
});

group = 'La excepción no se puede aprovechar';
const conPermiso = (id, q) => sqlErr(`begin; select set_config('censo.anonimizar','${id}',true); ${q}; commit;`);
await t('Con la excepción de una cuenta no se puede cambiar el club de su voto', () => {
  const e = conPermiso(testigo.id, `update public.votos set club_id='${clubB}' where usuario_id='${testigo.id}'`);
  must(e?.includes('no se puede cambiar ni borrar'), `error: ${e}`);
});
await t('Ni vaciar el dueño y cambiar el club a la vez', () => {
  const e = conPermiso(testigo.id, `update public.votos set usuario_id=null, club_id='${clubB}' where usuario_id='${testigo.id}'`);
  must(e?.includes('no se puede cambiar ni borrar'), `error: ${e}`);
});
await t('Ni cambiar el número o la fecha', () => {
  for (const cambio of ['numero_voto=numero_voto+1000', "created_at=created_at - interval '1 day'"]) {
    const e = conPermiso(testigo.id, `update public.votos set usuario_id=null, ${cambio} where usuario_id='${testigo.id}'`);
    must(e?.includes('no se puede cambiar ni borrar'), `${cambio}: ${e}`);
  }
});
await t('Ni borrar su voto', () => {
  const e = conPermiso(testigo.id, `delete from public.votos where usuario_id='${testigo.id}'`);
  must(e?.includes('no se puede cambiar ni borrar'), `error: ${e}`);
});
await t('Ni tocar el voto o el perfil de otra cuenta', () => {
  const e1 = conPermiso(testigo.id, `update public.votos set usuario_id=null where usuario_id='${otro.id}'`);
  const e2 = conPermiso(testigo.id, `delete from public.profiles where id='${otro.id}'`);
  must(e1?.includes('no se puede cambiar ni borrar') && e2?.includes('bloqueado'), `${e1} / ${e2}`);
});
await t('Después de la función, en la misma operación, la excepción ya no vale', () => {
  const extra = await_user_sync();
  const e = sqlErr(`begin; select private.anonimizar_votante('${extra.email}'); select set_config('censo.anonimizar', current_setting('censo.anonimizar', true), true); update public.votos set usuario_id=null where usuario_id='${otro.id}'; commit;`);
  must(e?.includes('no se puede cambiar ni borrar'), `error: ${e}`);
  must(rastros(otro).votos === '1' && sql(`select count(*) from auth.users where id='${extra.id}'`) === '1', 'cambió algo');
});
await t('Todas las protecciones dejaron intactos los datos', () => {
  must(totales() === totalesAntes && ranking() === rankingAntes, 'cambiaron los totales');
  for (const u of [testigo, otro]) must(rastros(u).users === '1' && rastros(u).profile === '1' && rastros(u).votos === '1', u.email);
});

// Cuenta auxiliar creada por SQL, para no depender de una promesa dentro de t().
function await_user_sync() {
  const email = `extra.${run}@prueba.local`;
  const id = sql(`insert into auth.users (id, instance_id, aud, role, email, email_confirmed_at, raw_user_meta_data)
    values (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', now(), '{}')
    returning id`).split('\n')[0];
  return { id, email };
}

group = 'Nadie más puede usar la función';
for (const rol of ['anon', 'authenticated', 'service_role']) {
  await t(`${rol} no puede ejecutarla`, () => {
    const e = sqlErr(`begin; set local role ${rol}; select private.anonimizar_votante('${testigo.email}'); commit;`);
    must(e?.includes('permission denied'), `error: ${e}`);
    must(rastros(testigo).users === '1', 'se borró');
  });
}
await t('No existe en la API pública (visitante, usuario ni clave secreta)', async () => {
  const body = { p_correo: testigo.email };
  for (const r of [
    await http('/rest/v1/rpc/anonimizar_votante', { method: 'POST', body }),
    await http('/rest/v1/rpc/anonimizar_votante', { method: 'POST', token: testigo.token, body }),
    await service('/rest/v1/rpc/anonimizar_votante', { method: 'POST', body }),
  ]) {
    must(r.status >= 400, brief(r));
  }
  must(rastros(testigo).users === '1', 'se borró');
});

group = 'Después de anonimizar todo sigue funcionando';
await t('Una cuenta sin voto se sigue borrando normal por Auth', async () => {
  const u = await user('borrable');
  const r = await service(`/auth/v1/admin/users/${u.id}`, { method: 'DELETE' });
  must(r.status === 200, brief(r));
  must(Object.values(rastros(u)).slice(0, 2).every((n) => n === '0') && rastros(u).profile === '0', JSON.stringify(rastros(u)));
});
await t('mi_voto sigue mostrando su voto a quien no salió', async () => {
  const r = await http('/rest/v1/rpc/mi_voto', { method: 'POST', token: testigo.token, body: {} });
  must(r.status === 200 && r.json?.length === 1, brief(r));
});
let juan2;
await t('Opción A: Juan puede registrarse otra vez con el mismo correo y votar', async () => {
  juan2 = await user('juan', { email: juan.email, meta: { full_name: 'Juan Pérez' } });
  must(juan2.id !== juan.id, 'mismo id');
  const r = await votar({ usuario_id: juan2.id, club_id: clubA, ...enProv });
  must(r.status === 201, brief(r));
});
await t('Su voto nuevo recibe un número nuevo; el anónimo no se reutiliza', () => {
  const max = Number(sql('select max(numero_voto) from public.votos'));
  const suyo = Number(sql(`select numero_voto from public.votos where usuario_id='${juan2.id}'`));
  must(suyo === max && suyo !== Number(numeroJuan), `suyo ${suyo}, max ${max}`);
  must(sql(`select count(*) from public.votos where numero_voto=${numeroJuan} and usuario_id is null`) === '1', 'se perdió el anónimo');
  return `voto anónimo N.º ${numeroJuan}, voto nuevo N.º ${suyo}`;
});
await t('Totales finales: 5 votos (3 con dueño y 2 anónimos) y ha_votado coherente', () => {
  const v = sql('select count(*) from public.votos');
  const conDueno = sql('select count(*) from public.votos where usuario_id is not null');
  const h = sql('select count(*) from public.profiles where ha_votado');
  must(v === '5' && conDueno === '3' && h === '3', `votos=${v}, con dueño=${conDueno}, ha_votado=${h}`);
  return `votos=${v}, con dueño=${conDueno}, anónimos=${Number(v) - Number(conDueno)}`;
});

let last = '';
for (const r of results) {
  if (r.group !== last) console.log(`\n## ${(last = r.group)}`);
  console.log(`${r.ok ? 'PASA ' : 'FALLA'} ${r.name}${r.detail ? `\n        ${r.detail}` : ''}`);
}
const fails = results.filter((r) => !r.ok).length;
console.log(`\nTOTAL: ${results.length} pruebas, ${results.length - fails} pasan, ${fails} fallan`);
process.exit(fails ? 1 : 0);
