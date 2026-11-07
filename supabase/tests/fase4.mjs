// Pruebas de la Fase 4 (docs/SUPABASE_SQL.md) contra Supabase LOCAL en Docker.
// Se niegan a correr contra otra URL y exigen una base local sin votos.
//
// Uso, desde la raíz del proyecto:
//   npx supabase start
//   npx supabase db reset
//   node supabase/tests/fase4.mjs
//
// Los votos no se pueden borrar, así que hay que ejecutar `db reset` antes de cada corrida.
import { execFileSync } from 'node:child_process';

const estado = execFileSync('npx', ['supabase', 'status', '-o', 'json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore'],
});
const { API_URL, ANON_KEY, SERVICE_ROLE_KEY, SECRET_KEY } = JSON.parse(estado);
if (!/^http:\/\/127\.0\.0\.1:/.test(API_URL ?? '')) {
  console.error('ABORTADO: la URL no es local');
  process.exit(2);
}
const CONTAINER = 'supabase_db_pagina-hinchas-ecuador';
const run = Date.now();
const results = [];
let group = '';

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

async function http(path, { method = 'GET', key = ANON_KEY, token, body, prefer } = {}) {
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      apikey: key,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
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
const denied = (r) => {
  must(r.status === 401 || r.status === 403, `se esperaba permiso denegado: ${brief(r)}`);
  must(r.json?.code === '42501', `código distinto a 42501: ${brief(r)}`);
  return brief(r);
};
const rejectedWith = (r, code, text) => {
  must(r.status >= 400, `debió rechazarse: ${brief(r)}`);
  must(r.json?.code === code, `se esperaba ${code}: ${brief(r)}`);
  if (text) must(r.text.includes(text), `se esperaba "${text}": ${brief(r)}`);
  return brief(r);
};

async function user(tag, { confirm = true, meta } = {}) {
  const email = `${tag}.${run}@prueba.local`;
  const password = `Clave-${run}-x!`;
  const r = await service('/auth/v1/admin/users', {
    method: 'POST',
    body: { email, password, email_confirm: confirm, user_metadata: meta ?? {} },
  });
  must(r.status === 200, `crear usuario ${tag}: ${brief(r)}`);
  let token = null;
  if (confirm) {
    const s = await http('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
    must(s.status === 200, `iniciar sesión ${tag}: ${brief(s)}`);
    token = s.json.access_token;
  }
  return { id: r.json.id, email, token };
}
const nombre = (u) => sql(`select coalesce(nombre_completo,'<null>') from public.profiles where id='${u.id}'`);
const haVotado = (u) => sql(`select ha_votado from public.profiles where id='${u.id}'`);
const votosDe = (u) => Number(sql(`select count(*) from public.votos where usuario_id='${u.id}'`));
const votar = (body, key = SERVICE_ROLE_KEY) =>
  http('/rest/v1/votos', { method: 'POST', key, token: key.startsWith('sb_') ? undefined : key, body });

if (sql('select count(*) from public.votos') !== '0') {
  console.error('ABORTADO: la base local ya tiene votos. Ejecuta primero: npx supabase db reset');
  process.exit(2);
}

// Catálogos de referencia
const [provA, provB] = sql(`select id from public.provincias order by nombre limit 2`).split('\n');
const cantonA = sql(`select id from public.cantones where provincia_id='${provA}' limit 1`);
const cantonB = sql(`select id from public.cantones where provincia_id='${provB}' limit 1`);
const [clubA, clubB] = sql(`select id from public.clubes order by nombre_oficial limit 2`).split('\n');
const continente = sql(`select id from public.continentes limit 1`);
const FANTASMA = '00000000-0000-0000-0000-000000000000';
const enProvA = { provincia_id: provA, canton_id: cantonA };

const nombreOriginal = 'Nombre Original';
const u1 = await user('votante', { meta: { full_name: nombreOriginal } });
const u2 = await user('otro', { meta: { name: 'Otro Usuario' } });
const conteoVotosInicial = Number(sql('select count(*) from public.votos'));

group = 'Perfil automático';
await t('Crear una cuenta crea su perfil con correo y nombre', () => {
  const row = sql(`select email,nombre_completo,ha_votado from public.profiles where id='${u1.id}'`);
  must(row === `${u1.email}|${nombreOriginal}|f`, `fila: ${row}`);
  return row.replace(u1.email, '<correo>');
});
await t('El nombre también se toma de "name" (como Google)', () => {
  must(nombre(u2) === 'Otro Usuario', nombre(u2));
});
await t('Un nombre de 200 letras se recorta a 150 sin impedir el registro', async () => {
  const u = await user('largo', { meta: { full_name: 'x'.repeat(200) } });
  must(nombre(u).length === 150, `largo ${nombre(u).length}`);
});
await t('Un nombre vacío queda sin nombre', async () => {
  const u = await user('vacio', { meta: { full_name: '   ' } });
  must(nombre(u) === '<null>', nombre(u));
});
await t('El registro público (signup) también crea el perfil', async () => {
  const email = `signup.${run}@prueba.local`;
  const r = await http('/auth/v1/signup', { method: 'POST', body: { email, password: `Clave-${run}-x!`, data: { ha_votado: true } } });
  must(r.status === 200, brief(r));
  const row = sql(`select ha_votado from public.profiles where email='${email}'`);
  must(row === 'f', `ha_votado=${row}`);
});

group = 'Visitante sin cuenta';
await t('No puede votar', async () => denied(await http('/rest/v1/votos', { method: 'POST', body: { usuario_id: u1.id, club_id: clubA, ...enProvA } })));
await t('No puede leer votos', async () => denied(await http('/rest/v1/votos?select=*')));
await t('No puede leer perfiles', async () => denied(await http('/rest/v1/profiles?select=*')));
await t('No puede editar perfiles', async () => denied(await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'PATCH', body: { nombre_completo: 'hack' } })));
await t('Las funciones internas no son accesibles por la API', async () => {
  const r = await http('/rest/v1/rpc/marcar_ha_votado', { method: 'POST', body: {} });
  must(r.status === 404, brief(r));
  return brief(r);
});
await t('GraphQL no muestra votos ni perfiles', async () => {
  const r = await http('/graphql/v1', { method: 'POST', body: { query: '{__schema{types{name}}}' } });
  must(r.status === 200, brief(r));
  const names = (r.json?.data?.__schema?.types ?? []).map((x) => x.name.toLowerCase());
  must(!names.some((n) => n.includes('voto') || n.includes('profile')), 'aparece votos o profiles');
});

group = 'Perfil antes de votar';
await t('El usuario lee solo su propio perfil', async () => {
  const r = await http('/rest/v1/profiles?select=id', { token: u1.token });
  must(r.status === 200 && r.json.length === 1 && r.json[0].id === u1.id, `${r.status}: ${r.json?.length} filas`);
  return '1 fila, la suya';
});
await t('No puede leer el perfil ajeno', async () => {
  const r = await http(`/rest/v1/profiles?id=eq.${u2.id}&select=*`, { token: u1.token });
  must(r.status === 200 && r.json.length === 0, `${r.status}: ${r.text}`);
});
await t('No puede editar el perfil ajeno', async () => {
  await http(`/rest/v1/profiles?id=eq.${u2.id}`, { method: 'PATCH', token: u1.token, body: { nombre_completo: 'hack' } });
  must(nombre(u2) === 'Otro Usuario', nombre(u2));
});
await t('Puede corregir su nombre', async () => {
  const r = await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'PATCH', token: u1.token, body: { nombre_completo: 'Nombre Corregido' } });
  must(r.status === 204, brief(r));
  must(nombre(u1) === 'Nombre Corregido', nombre(u1));
});
await t('No puede cambiar su email', async () => {
  const d = denied(await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'PATCH', token: u1.token, body: { email: 'x@x.com' } }));
  must(sql(`select email from public.profiles where id='${u1.id}'`) === u1.email, 'el email cambió');
  return d;
});
await t('No puede activar ha_votado', async () => {
  const d = denied(await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'PATCH', token: u1.token, body: { ha_votado: true } }));
  must(haVotado(u1) === 'f', 'ha_votado cambió');
  return d;
});
await t('No puede crear ni borrar perfiles', async () => {
  denied(await http('/rest/v1/profiles', { method: 'POST', token: u1.token, body: { id: u1.id, email: 'a@a.com' } }));
  denied(await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'DELETE', token: u1.token }));
  must(haVotado(u1) === 'f', 'perfil borrado');
});
await t('Ni la base de datos directa puede cambiar ha_votado', () => {
  const e = sqlErr(`update public.profiles set ha_votado=true where id='${u1.id}'`);
  must(e?.includes('ha_votado solo lo puede cambiar el sistema'), `error: ${e}`);
  must(haVotado(u1) === 'f', 'ha_votado cambió');
});

group = 'Votos rechazados';
const sinVoto = () => must(votosDe(u1) === 0 && haVotado(u1) === 'f', 'quedó voto o ha_votado activo');
await t('Un usuario no puede votar directamente con su sesión', async () => {
  const d = denied(await http('/rest/v1/votos', { method: 'POST', token: u1.token, body: { usuario_id: u1.id, club_id: clubA, ...enProvA } }));
  sinVoto();
  return d;
});
await t('Un usuario no puede votar a nombre de otro', async () => {
  const d = denied(await http('/rest/v1/votos', { method: 'POST', token: u1.token, body: { usuario_id: u2.id, club_id: clubA, ...enProvA } }));
  must(votosDe(u2) === 0, 'quedó voto');
  return d;
});
await t('Una cuenta sin correo verificado no puede votar', async () => {
  const u = await user('sinverificar', { confirm: false });
  const r = rejectedWith(await votar({ usuario_id: u.id, club_id: clubA, ...enProvA }), 'P0001', 'correo verificado');
  must(votosDe(u) === 0 && haVotado(u) === 'f', 'quedó voto');
  return r;
});
await t('Un usuario inexistente no puede votar', async () =>
  rejectedWith(await votar({ usuario_id: FANTASMA, club_id: clubA, ...enProvA }), 'P0001', 'correo verificado'));
await t('Un cantón de otra provincia es rechazado', async () => {
  const r = rejectedWith(await votar({ usuario_id: u1.id, club_id: clubA, provincia_id: provA, canton_id: cantonB }), '23503', 'votos_canton_provincia_fkey');
  sinVoto();
  return r;
});
await t('Un club inexistente es rechazado', async () => {
  const r = rejectedWith(await votar({ usuario_id: u1.id, club_id: FANTASMA, ...enProvA }), '23503');
  sinVoto();
  return r;
});
for (const [nombreCaso, ubic] of [
  ['sin ubicación', {}],
  ['continente y provincia a la vez', { continente_id: continente, ...enProvA }],
  ['provincia sin cantón', { provincia_id: provA }],
  ['cantón sin provincia', { canton_id: cantonA }],
  ['continente con cantón', { continente_id: continente, canton_id: cantonA }],
]) {
  await t(`Ubicación inválida: ${nombreCaso}`, async () => {
    const r = rejectedWith(await votar({ usuario_id: u1.id, club_id: clubA, ...ubic }), '23514', 'check_ubicacion_valida');
    sinVoto();
    return r;
  });
}
await t('Una cuenta sin perfil no puede votar', async () => {
  const u = await user('sinperfil');
  sql(`delete from public.profiles where id='${u.id}'`);
  const r = rejectedWith(await votar({ usuario_id: u.id, club_id: clubA, ...enProvA }), 'P0001', 'no tiene perfil');
  must(votosDe(u) === 0, 'quedó voto');
  return r;
});

group = 'Voto válido y doble voto';
await t('El voto entra y activa ha_votado en la misma operación', async () => {
  const r = await votar({ usuario_id: u1.id, club_id: clubA, ...enProvA, created_at: '2000-01-01T00:00:00Z' });
  must(r.status === 201, brief(r));
  must(votosDe(u1) === 1, 'sin voto');
  must(haVotado(u1) === 't', 'ha_votado sigue en false');
  return brief(r);
});
await t('La fecha la pone la base de datos, no quien envía el voto', () => {
  const y = sql(`select extract(year from created_at) = extract(year from now()) from public.votos where usuario_id='${u1.id}'`);
  must(y === 't', 'se aceptó la fecha falsa');
});
await t('Segundo voto rechazado, aun con otro club', async () => {
  const r = rejectedWith(await votar({ usuario_id: u1.id, club_id: clubB, ...enProvA }), '23505');
  must(votosDe(u1) === 1, 'hay más de un voto');
  must(sql(`select club_id from public.votos where usuario_id='${u1.id}'`) === clubA, 'cambió el club');
  return r;
});
await t('20 votos simultáneos de la misma cuenta: solo entra uno', async () => {
  const u = await user('simultaneo');
  const rs = await Promise.all(Array.from({ length: 20 }, (_, i) => votar({ usuario_id: u.id, club_id: i % 2 ? clubA : clubB, ...enProvA })));
  const ok = rs.filter((r) => r.status === 201).length;
  const dup = rs.filter((r) => r.json?.code === '23505').length;
  must(ok === 1 && dup === 19, `aceptados=${ok}, duplicados=${dup}, otros=${rs.filter((r) => r.status !== 201 && r.json?.code !== '23505').map(brief).join('; ')}`);
  must(votosDe(u) === 1 && haVotado(u) === 't', 'estado final incorrecto');
  return `aceptados=${ok}, rechazados=${dup}, en base=1`;
});
await t('Voto desde el exterior con continente (con la secret key nueva)', async () => {
  must(SECRET_KEY?.startsWith('sb_secret_'), 'no hay secret key sb_secret');
  const u = await user('exterior');
  const r = await votar({ usuario_id: u.id, club_id: clubA, continente_id: continente }, SECRET_KEY);
  must(r.status === 201, brief(r));
  must(votosDe(u) === 1 && haVotado(u) === 't', 'estado final incorrecto');
  return brief(r);
});
await t('Dos clubes distintos pueden recibir votos de cuentas distintas', async () => {
  const u = await user('otroclub');
  const r = await votar({ usuario_id: u.id, club_id: clubB, provincia_id: provB, canton_id: cantonB });
  must(r.status === 201, brief(r));
});

group = 'El voto no se puede tocar';
const voto = () => sql(`select club_id,created_at from public.votos where usuario_id='${u1.id}'`);
const antes = voto();
const filtro = `usuario_id=eq.${u1.id}`;
await t('El usuario no puede leer su voto por la API', async () => denied(await http(`/rest/v1/votos?${filtro}&select=*`, { token: u1.token })));
await t('El usuario no puede editar ni borrar su voto', async () => {
  denied(await http(`/rest/v1/votos?${filtro}`, { method: 'PATCH', token: u1.token, body: { club_id: clubB } }));
  denied(await http(`/rest/v1/votos?${filtro}`, { method: 'DELETE', token: u1.token }));
  must(voto() === antes, 'el voto cambió');
});
await t('La clave secreta no puede leer votos', async () => denied(await service(`/rest/v1/votos?${filtro}&select=*`)));
await t('La clave secreta no puede editar ni borrar votos', async () => {
  denied(await service(`/rest/v1/votos?${filtro}`, { method: 'PATCH', body: { club_id: clubB } }));
  denied(await service(`/rest/v1/votos?${filtro}`, { method: 'DELETE' }));
  must(voto() === antes, 'el voto cambió');
});
for (const [titulo, q, user_] of [
  ['UPDATE directo como dueño de la tabla', `update public.votos set club_id='${clubB}' where usuario_id='${u1.id}'`, 'postgres'],
  ['DELETE directo como dueño de la tabla', `delete from public.votos where usuario_id='${u1.id}'`, 'postgres'],
  ['TRUNCATE directo como dueño de la tabla', `truncate public.votos`, 'postgres'],
  ['UPDATE directo como superusuario', `update public.votos set club_id='${clubB}' where usuario_id='${u1.id}'`, 'supabase_admin'],
  ['DELETE directo como superusuario', `delete from public.votos where usuario_id='${u1.id}'`, 'supabase_admin'],
  ['TRUNCATE directo como superusuario', `truncate public.votos`, 'supabase_admin'],
  ['TRUNCATE de clubes en cascada', `truncate public.clubes cascade`, 'postgres'],
]) {
  await t(titulo, () => {
    const e = sqlErr(q, user_);
    must(e?.includes('Un voto emitido no se puede cambiar ni borrar'), `error: ${e}`);
    must(voto() === antes, 'el voto cambió');
  });
}
await t('No se puede borrar un club, cantón o provincia con votos', () => {
  for (const q of [
    `delete from public.clubes where id='${clubA}'`,
    `delete from public.cantones where id='${cantonA}'`,
    `delete from public.provincias where id='${provA}'`,
  ]) {
    const e = sqlErr(q);
    must(e?.includes('foreign key') || e?.includes('llave foránea'), `error: ${e}`);
  }
});

group = 'Perfil bloqueado tras votar';
await t('El usuario ya no puede corregir su nombre', async () => {
  await http(`/rest/v1/profiles?id=eq.${u1.id}`, { method: 'PATCH', token: u1.token, body: { nombre_completo: 'Cambio Tardío' } });
  must(nombre(u1) === 'Nombre Corregido', nombre(u1));
});
await t('La base de datos directa tampoco puede cambiarlo ni desmarcar ha_votado', () => {
  for (const c of [`nombre_completo='x'`, `ha_votado=false`]) {
    const e = sqlErr(`update public.profiles set ${c} where id='${u1.id}'`);
    must(e?.includes('bloqueado'), `error: ${e}`);
  }
  must(nombre(u1) === 'Nombre Corregido' && haVotado(u1) === 't', 'perfil cambió');
});
await t('El perfil de quien votó no se puede borrar', () => {
  const e = sqlErr(`delete from public.profiles where id='${u1.id}'`);
  must(e?.includes('bloqueado'), `error: ${e}`);
});

group = 'Borrado de cuentas';
await t('Una cuenta sin voto se borra, y su perfil con ella', async () => {
  const u = await user('borrable');
  const r = await service(`/auth/v1/admin/users/${u.id}`, { method: 'DELETE' });
  must(r.status === 200, brief(r));
  must(sql(`select count(*) from public.profiles where id='${u.id}'`) === '0', 'el perfil sigue');
  must(sql(`select count(*) from auth.users where id='${u.id}'`) === '0', 'la cuenta sigue');
});
await t('Una cuenta que ya votó no se puede borrar por Auth', async () => {
  const r = await service(`/auth/v1/admin/users/${u1.id}`, { method: 'DELETE' });
  must(r.status >= 400, `debió rechazarse: ${brief(r)}`);
  must(sql(`select count(*) from auth.users where id='${u1.id}'`) === '1', 'la cuenta se borró');
  must(votosDe(u1) === 1 && haVotado(u1) === 't', 'se perdió el voto o el perfil');
  return `HTTP ${r.status}`;
});
await t('Tampoco por SQL directo', () => {
  const e = sqlErr(`delete from auth.users where id='${u1.id}'`);
  must(e?.includes('bloqueado') || e?.includes('foreign key'), `error: ${e}`);
  must(sql(`select count(*) from auth.users where id='${u1.id}'`) === '1', 'la cuenta se borró');
  must(votosDe(u1) === 1 && haVotado(u1) === 't', 'se perdió el voto o el perfil');
});

group = 'Catálogos';
for (const tabla of ['continentes', 'provincias', 'cantones', 'clubes']) {
  await t(`${tabla}: el público lee, pero nadie sin permiso escribe`, async () => {
    const total = sql(`select count(*) from public.${tabla}`);
    const g = await http(`/rest/v1/${tabla}?select=id&limit=1`);
    must(g.status === 200 && g.json.length === 1, `lectura: ${brief(g)}`);
    const campo = tabla === 'clubes' ? 'nombre_oficial' : 'nombre';
    for (const opts of [{}, { token: u1.token }]) {
      denied(await http(`/rest/v1/${tabla}`, { method: 'POST', ...opts, body: { [campo]: 'hack' } }));
      denied(await http(`/rest/v1/${tabla}?id=eq.${FANTASMA}`, { method: 'PATCH', ...opts, body: { [campo]: 'hack' } }));
      denied(await http(`/rest/v1/${tabla}?id=eq.${FANTASMA}`, { method: 'DELETE', ...opts }));
    }
    must(sql(`select count(*) from public.${tabla}`) === total, 'cambió el total');
  });
}

group = 'Permisos en la base de datos';
await t('Permisos exactos de profiles y votos', () => {
  const rows = sql(`
    select grantee||'.'||table_name||'.'||privilege_type from information_schema.role_table_grants
    where table_schema='public' and table_name in ('profiles','votos')
      and grantee in ('anon','authenticated','service_role','PUBLIC') order by 1`);
  const esperado = ['authenticated.profiles.SELECT', 'service_role.votos.INSERT'].join('\n');
  must(rows === esperado, `encontrado:\n${rows}`);
  return rows.replace('\n', ', ');
});
await t('Permisos de columna en profiles: solo nombre_completo', () => {
  const rows = sql(`
    select grantee||'.'||column_name||'.'||privilege_type from information_schema.column_privileges
    where table_schema='public' and table_name='profiles' and privilege_type='UPDATE'
      and grantee in ('anon','authenticated','service_role','PUBLIC') order by 1`);
  must(rows === 'authenticated.nombre_completo.UPDATE', `encontrado:\n${rows}`);
});
await t('RLS activo en todas las tablas públicas', () => {
  const rows = sql(`select relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and not c.relrowsecurity`);
  must(rows === '', `sin RLS: ${rows}`);
});
await t('El esquema private no es accesible', () => {
  for (const r of ['anon', 'authenticated', 'service_role']) {
    must(sql(`select has_schema_privilege('${r}','private','USAGE')`) === 'f', `${r} tiene acceso`);
  }
});
await t('Sin votos perdidos ni inventados en toda la corrida', () => {
  const v = Number(sql('select count(*) from public.votos'));
  const h = Number(sql('select count(*) from public.profiles where ha_votado'));
  must(conteoVotosInicial === 0, `inicial ${conteoVotosInicial}`);
  must(v === 4 && h === 4, `votos=${v}, ha_votado=${h}`);
  return `votos=${v}, ha_votado=${h}`;
});

let last = '';
for (const r of results) {
  if (r.group !== last) console.log(`\n## ${(last = r.group)}`);
  console.log(`${r.ok ? 'PASA ' : 'FALLA'} ${r.name}${r.detail ? `\n        ${r.detail}` : ''}`);
}
const fails = results.filter((r) => !r.ok).length;
console.log(`\nTOTAL: ${results.length} pruebas, ${results.length - fails} pasan, ${fails} fallan`);
process.exit(fails ? 1 : 0);
