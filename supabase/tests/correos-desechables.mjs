// Pruebas del paso 6 (bloqueo de correos temporales) contra Supabase LOCAL en Docker.
// Se niegan a correr contra otra URL.
//
// Uso, desde la raíz del proyecto:
//   npx supabase start
//   npx supabase db reset
//   node supabase/tests/correos-desechables.mjs
//
// En local, Supabase permite 2 correos por hora (supabase/config.toml): esta prueba
// envía 1 (a Mailpit, nunca a un correo real).
import { execFileSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";

const estado = execFileSync("npx", ["supabase", "status", "-o", "json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
});
const { API_URL, ANON_KEY } = JSON.parse(estado);
if (!/^http:\/\/127\.0\.0\.1:/.test(API_URL ?? "")) {
  console.error("ABORTADO: la URL no es local");
  process.exit(2);
}
const CONTAINER = "supabase_db_pagina-hinchas-ecuador";
const results = [];
let group = "";

// supabase_admin (superusuario local) puede adoptar el rol supabase_auth_admin.
const sql = (q, user = "supabase_admin") =>
  execFileSync(
    "docker",
    [
      "exec",
      "-i",
      CONTAINER,
      "psql",
      "-U",
      user,
      "-d",
      "postgres",
      "-At",
      "-v",
      "ON_ERROR_STOP=1",
      "-c",
      q,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
const sqlErr = (q) => {
  try {
    sql(q);
    return null;
  } catch (e) {
    return String(e.stderr);
  }
};
const check = (name, ok, detail = "") => {
  results.push({ group, name, ok });
  console.log(
    `${ok ? "OK  " : "FALLA"} [${group}] ${name}${detail ? ` — ${detail}` : ""}`,
  );
};

// Llama a la regla como lo hace Supabase Auth (rol supabase_auth_admin).
const hook = (email) =>
  sql(
    `begin; set local role supabase_auth_admin; select acceso.rechazar_correo_desechable(${
      email === null
        ? `'{"user":{}}'::jsonb`
        : `jsonb_build_object('user', jsonb_build_object('email', '${email.replaceAll("'", "''")}'))`
    })::text; commit;`,
  )
    .split("\n")
    .find((l) => l.startsWith("{"));
const rechaza = (email) => hook(email).includes("correo-desechable");

group = "Regla";
check(
  "lista cargada completa",
  sql("select count(*) from acceso.dominios_desechables") === "10181",
);
check("rechaza mailinator.com", rechaza("alguien@mailinator.com"));
check("rechaza en mayúsculas", rechaza("Alguien@MAILINATOR.COM"));
check("rechaza subdominios", rechaza("alguien@abc.mailinator.com"));
check("rechaza yopmail.com", rechaza("alguien@yopmail.com"));
for (const ok of [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com",
  "icloud.com",
  "live.com",
  "espol.edu.ec",
]) {
  check(`deja pasar ${ok}`, hook(`alguien@${ok}`) === "{}");
}
check("respeta excepciones (rma.ec)", hook("alguien@rma.ec") === "{}");
check("sin correo deja pasar", hook(null) === "{}");
check("correo sin @ deja pasar (lo valida Auth)", hook("sin-arroba") === "{}");

group = "Permisos";
for (const rol of ["anon", "authenticated"]) {
  check(
    `${rol} no lee la lista`,
    sqlErr(
      `begin; set local role ${rol}; select count(*) from acceso.dominios_desechables; commit;`,
    ) !== null,
  );
  check(
    `${rol} no ejecuta la regla`,
    sqlErr(
      `begin; set local role ${rol}; select acceso.rechazar_correo_desechable('{}'); commit;`,
    ) !== null,
  );
}
check(
  "supabase_auth_admin no puede modificar la lista",
  sqlErr(
    `begin; set local role supabase_auth_admin; delete from acceso.dominios_desechables; commit;`,
  ) !== null,
);

group = "Auth de punta a punta";
const supabase = createClient(API_URL, ANON_KEY, {
  auth: { persistSession: false },
});
const stamp = Date.now();
const temporal = `prueba${stamp}@mailinator.com`;
const { error: errTemporal } = await supabase.auth.signInWithOtp({
  email: temporal,
});
console.log(
  "      error recibido por la app:",
  JSON.stringify({
    status: errTemporal?.status,
    code: errTemporal?.code,
    message: errTemporal?.message,
  }),
);
check("pedir código con correo temporal da error", errTemporal !== null);
check(
  "no se creó la cuenta temporal",
  sql(`select count(*) from auth.users where email = '${temporal}'`) === "0",
);
const normal = `prueba${stamp}@gmail.com`;
const { error: errNormal } = await supabase.auth.signInWithOtp({
  email: normal,
});
check(
  "pedir código con Gmail funciona",
  errNormal === null,
  errNormal?.message ?? "",
);
check(
  "se creó la cuenta de Gmail",
  sql(`select count(*) from auth.users where email = '${normal}'`) === "1",
);

const fallas = results.filter((r) => !r.ok);
console.log(
  `\n${results.length - fallas.length}/${results.length} pruebas correctas`,
);
process.exit(fallas.length ? 1 : 0);
