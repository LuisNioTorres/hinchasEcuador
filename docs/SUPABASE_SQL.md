# SUPABASE-SQL

Registro de la etapa de base de datos: qué está hecho, cómo está configurado y qué se decidió.

## Reglas de este registro

- **Leer primero:** leer este archivo antes de trabajar en la base de datos.
- **Cambios importantes:** consultar siempre al dueño antes de hacer un cambio importante en este archivo, `CLAUDE.md`, `docs/` o `supabase/migrations/`, como cambiar requisitos, decisiones o la estructura de la base de datos. Las correcciones menores y las actualizaciones del checklist no requieren consulta.
- **Requisitos:** están en `docs/DATOS_INFORMATION.md`, y cada decisión aprobada se corrige también allí.
- **Estructura real:** la definen los archivos SQL de `supabase/migrations/`. No cambiar la base de datos desde el panel de Supabase sin dejar su migración.
- **Checklist:** marcar una tarea solo cuando esté verificada.
- **Secretos:** nunca escribir aquí, ni en ningún archivo versionado, la contraseña de la base de datos ni la secret key.

## Configuración actual

| Ajuste | Valor |
| :--- | :--- |
| Proyecto | `pagina-hinchas-ecuador` |
| Organización | `censoHinchas` |
| Plan | Free |
| Región | North Virginia |
| Motor | PostgreSQL 17.11 |
| Referencia del proyecto | `lsyrovxrecympvnfpjgj` |
| URL | `https://lsyrovxrecympvnfpjgj.supabase.co` |
| Data API | Activada |
| Automatically expose new tables | Desactivada: cada tabla necesita permisos explícitos (`GRANT`) además de sus políticas RLS |
| Automatic RLS | Activada |
| Conexión con Next.js | `src/lib/supabase/`, con los datos públicos en `.env.local` |
| Supabase CLI | Dependencia de desarrollo del proyecto (3.0.0), para aplicar las migraciones. `db push` actúa en local por defecto; el proyecto real requiere `--remote` |
| Entorno de pruebas | Docker Desktop local (instalado el 2026-11-07) |

Confirmado en el proyecto real el 2026-11-06: PostgreSQL 17.11, Data API respondiendo, Automatic RLS activo y tablas nuevas sin permisos de lectura ni escritura para `anon` y `authenticated`. Esas tablas sí reciben por defecto `TRUNCATE`, `REFERENCES`, `TRIGGER` y `MAINTAIN`, por lo que cada migración debe quitarlos con `REVOKE ALL`.

## Decisiones del dueño (2026-11-06)

| # | Tema | Decisión |
| :--- | :--- | :--- |
| 1 | Perfil | Antes de votar, el usuario solo puede corregir su nombre. Se bloquea para siempre una vez que vota. `ha_votado` lo cambia solo el sistema. |
| 2 | Nivel geográfico | Llega hasta cantón. No se usan ciudades ni parroquias. |
| 3 | Otros países | El proyecto es solo de Ecuador y lo más simple posible. No hay tabla `paises`. Los usuarios en el exterior eligen continente. |
| 4 | Protección contra bots | El usuario normal solo vota, sin CAPTCHA. La verificación adicional aparece solo si el sistema detecta un robot. El voto entra por el servidor, sin que el usuario lo note, para que nadie pueda saltarse esa protección. |
| 5 | Clubes | Claude crea la tabla y prepara los registros. La carga viene después, con ayuda del dueño en casos dudosos de nombre, color o escudo. |
| 6 | Colores | Dos clubes pueden compartir el mismo color. |
| 7 | Borrado de cuenta | No hay opción para borrar la cuenta y la base de datos rechaza borrar una cuenta que ya votó. Las solicitudes legales se atienden a mano. **Pendiente:** revisar el procedimiento con un abogado antes del lanzamiento. |
| 8 | Migraciones | Se aplican con Supabase CLI. El dueño inicia sesión en su computadora y no comparte ninguna clave. |
| 9 | Provincias y cantones | Claude los investiga en fuentes oficiales y los carga, con revisión del dueño. |
| 10 | Privacidad | Nunca se verá públicamente quién votó por quién. Solo se publican resultados totales. |
| 11 | Pruebas | Las pruebas de seguridad se hacen en Docker Desktop local, sin tocar el proyecto real ni dejar votos de prueba. El dueño pidió crear primero las tablas; Docker se necesita antes de las pruebas de la Fase 4. |
| 12 | Reglas de la Fase 2 | Aprobadas el 2026-11-06: bloqueo real del voto, perfil bloqueado al votar, `ha_votado` automático, perfil automático, correo verificado para votar, cantón de la provincia elegida, y cuenta con voto imposible de borrar. |
| 13 | Clubes | Cualquier persona puede votar por cualquier club. La provincia del club no tiene ningún efecto en el sistema. |
| 14 | Perfil (2026-11-09) | Reemplaza lo dicho sobre el bloqueo del perfil en las decisiones 1 y 12: el usuario puede cambiar su nombre y apellido siempre, también después de votar. El voto sigue bloqueado. **Pendiente:** migración que ajuste la política y el trigger de `profiles`, que hoy bloquean el perfil al votar. |
| 15 | Migración del perfil (2026-11-09) | El dueño la aprobó y delegó el momento: se hará una sola, al conectar la autenticación real, y se probará antes en local. Incluirá: edición del nombre siempre (decisión 14), `nombre_completo` separado en `nombre` y `apellido`, y el número de voto. |
| 17 | Clubes sin votos (2026-11-09) | No aparecen en rankings ni clasificaciones: las vistas solo entregan clubes con al menos un voto. |
| 18 | Total Internacional (2026-11-09) | Es la suma por club de `vista_ranking_continental`, calculada en la aplicación. No hay sexta vista. |
| 16 | ID DEL HINCHA (2026-11-09) | Es el número de orden del voto en el censo y lo asigna la base de datos al registrar el voto. No se puede editar. El identificador interno de la cuenta (UUID) sigue existiendo, pero no se muestra. |
| 19 | Correos temporales (2026-11-10) | Se rechazan las cuentas nuevas con dominios de correo temporal, con un hook *Before User Created* de Supabase Auth (plan Free). La lista es una versión fija y revisada de *disposable-email-domains* (CC0), guardada en la migración; no se consulta internet al funcionar. Los dominios `.ec` de la lista que no se pudieron confirmar (`rma.ec`, `tic.ec`) quedan como excepciones. Texto para el usuario: "Ese correo es temporal y no se puede usar para votar. Usa tu correo personal." |

## Riesgos abiertos de la auditoría (2026-11-06)

Se resuelven en la fase indicada, cuyo diseño debe aprobar el dueño.

| Riesgo | Fase |
| :--- | :--- |
| Las vistas deben leer `votos` sin abrirla al público; documentar la excepción ante el asesor de Supabase | 3 |
| Definir qué entregan 3 de las vistas y si aparecen los clubes con 0 votos; agregar índices y medir | 3 |
| Bloquear el cambio de correo en Supabase Auth, para evitar votar otra vez con el correo anterior | Login |
| Una persona puede votar varias veces usando varios correos | Antes del lanzamiento |
| Un administrador puede ver quién votó por quién desde el panel; incluirlo en la revisión legal | Antes del lanzamiento |

## Checklist

### Fase 0: Preparación
- [x] Proyecto creado en Supabase y conectado con Next.js
- [x] Decisiones 1 a 13 tomadas
- [x] Documentos corregidos (auditoría del 2026-11-06)
- [x] Cambios guardados en GitHub (commit del dueño)
- [x] CLI enlazada al proyecto real y simulación de migraciones correcta (`db push --remote --dry-run`)
- [x] Ajustes de seguridad confirmados en el proyecto real
- [x] Diseño de las tablas de catálogos aprobado por el dueño (2026-11-06)
- [x] Docker Desktop instalado (antes de las pruebas de la Fase 4)

### Fase 1: Catálogos
- [x] Tablas de continentes, provincias, cantones y clubes (`20261106120000_crear_catalogos.sql`)
- [x] Reglas de lectura pública, verificadas: el público lee, pero no puede crear, cambiar ni borrar
- [x] Carga de 7 continentes, 24 provincias y 222 cantones (`20261106120100_cargar_geografia.sql`)
- [x] Revisión de los datos cargados por el dueño (aprobada el 2026-11-06)

Fuentes de la carga: lista de INEC de 2012 publicada en una capa cartográfica que cita a INEC, más La Concordia (Asamblea Nacional, 2013) y Sevilla Don Bosco (Asamblea Nacional, 2024). Falta contrastar la lista con un archivo publicado por INEC y con el Registro Oficial. "El Empalme" se escribe con artículo, aunque INEC lo lista como "Empalme".

### Fase 2: Usuarios y votos
- [x] Tablas `profiles` y `votos` creadas (`20261106140000_crear_profiles_votos.sql`)
- [x] Permisos revisados: un visitante no puede leer ni escribir en ellas
- [x] Reglas probadas con usuarios y votos simulados en local (2026-11-07; ver Fase 4)

### Fase 3: Resultados

Probada en Docker local el 2026-11-09 con `supabase/tests/resultados.mjs` (38 de 38). Las vistas se ejecutan con los permisos de su dueño para contar `votos` sin abrirla: es la excepción esperada ante el asesor de Supabase.

- [x] Las 5 vistas de rankings (`20261109130000_vistas_rankings.sql`), probadas en local
- [x] Vistas aplicadas en el proyecto real (2026-11-09; el asesor marca las 5 como `security_definer_view`, excepción intencional ya documentada)
- [x] Desempate alfabético y porcentajes correctos
- [x] Las vistas no revelan datos de los votantes

### Fase 4: Pruebas
Ejecutadas en Docker local el 2026-11-07, sin tocar el proyecto real: 65 de 65 pruebas correctas. Se repiten con `supabase/tests/fase4.mjs`; las instrucciones están al inicio del archivo.

Revisión del proyecto real (2026-11-07): las migraciones coinciden. `profiles` y `votos` tienen los mismos permisos que en local, y sus políticas y triggers están activos. Se encontraron dos temas, que corrige `20261107120000_corregir_permisos.sql` (aplicada el 2026-11-07). Después de aplicarla, el asesor ya no da advertencias ni errores; quedan 6 avisos informativos, a revisar en la Fase 3 (índices) o intencionales (`votos` sin políticas):

- El asesor advierte que `anon` y `authenticated` pueden ejecutar `public.rls_auto_enable()`, función de Automatic RLS que solo existe en el proyecto real. Una copia probada en local rechazó la llamada, por ser de tipo `event_trigger`.
- En el proyecto real, `service_role` conserva `TRUNCATE`, `REFERENCES`, `TRIGGER` y `MAINTAIN` en los catálogos, y no puede leerlos. La migración de catálogos solo quitó permisos a `anon` y `authenticated`.

- [x] Un visitante no puede votar ni leer votos individuales
- [x] Un usuario no puede votar dos veces, ni editar o borrar su voto
- [x] Dos votos simultáneos de la misma cuenta: solo entra uno
- [x] El perfil se crea automáticamente con la cuenta
- [x] `ha_votado` se activa con el voto, y una cuenta sin correo verificado no puede votar
- [x] Una cuenta sin voto se puede borrar y su perfil se borra con ella
- [x] Nadie puede cambiar un voto, ni siquiera con la clave secreta del servidor
- [x] Un usuario no puede escribir en los catálogos ni ver o editar perfiles ajenos
- [x] Un usuario no puede cambiar su `email` ni `ha_votado`, y su perfil queda bloqueado al votar
- [x] Un cantón de otra provincia es rechazado
- [x] Una cuenta que ya votó no se puede borrar
- [x] Revisión con el asesor de seguridad de Supabase en el proyecto real
- [x] Lint y build correctos

### Etapa de login y voto real
Probada en Docker local el 2026-11-09, sin tocar el proyecto real: 77 de 77 pruebas de base de datos (`supabase/tests/fase4.mjs`) y 75 de 75 comprobaciones del recorrido en navegador.

- [x] Migración `20261109120000_perfil_editable_numero_voto.sql` probada en local
- [x] Bloqueo del cambio de correo (riesgo de la fase Login)
- [x] Migración aplicada en el proyecto real (2026-11-09; el asesor avisa que `mi_voto` es ejecutable por usuarios con sesión, y es intencional)
- [x] `SUPABASE_SECRET_KEY` en `.env.local`
- [ ] `SUPABASE_SECRET_KEY` en Vercel
- [x] Plantilla `supabase/templates/acceso.html` en el panel (Magic Link y Confirm signup, 2026-11-09)
- [x] SMTP propio con Resend y límite de 100 correos por hora (2026-11-09)
- [x] Corregir los problemas de la prueba del paso 4 (ver abajo; el 5, correo en spam, se revisa en la prueba final)
- [ ] URLs del sitio y de redirección en el panel
- [ ] Google activado y probado de punta a punta

### Bloqueo de correos temporales (paso 6 del plan, 2026-11-10)
Migración `20261110120000_bloquear_correos_desechables.sql` (decisión 19). Crea el esquema `acceso`, fuera de la API pública, con `dominios_desechables` (10 181 dominios del commit `ba992a0` de *disposable-email-domains*), `dominios_permitidos` (excepciones con motivo) y la función `acceso.rechazar_correo_desechable`, que solo puede ejecutar y leer `supabase_auth_admin`. Revisa también los dominios padre (`abc.mailinator.com` cae por `mailinator.com`). Si rechaza, la app recibe `403` con el mensaje `correo-desechable` y muestra el texto aprobado (`src/components/login/login-form.tsx`). En local se activa en `supabase/config.toml` (`[auth.hook.before_user_created]`): tras cambiarlo hay que reiniciar con `supabase stop` y `supabase start`, porque `db reset` no recarga la configuración de Auth.

- [x] Lista revisada antes de cargarla: formato, duplicados, sin proveedores legítimos y dominios `.ec`
- [x] Probada en Docker local: 24 de 24 pruebas (`supabase/tests/correos-desechables.mjs`), incluido el recorrido de Auth (un correo temporal no crea la cuenta; Gmail sí)
- [x] Pantalla de inicio de sesión probada contra Supabase local: muestra el texto aprobado con un correo temporal y pasa a "Revisa tu correo" con Gmail
- [x] Migración aplicada en el proyecto real (2026-11-10, `npx supabase db push --remote`)
- [x] Hook activado en el panel (Authentication → Hooks → Before User Created → Postgres, esquema `acceso`, función `rechazar_correo_desechable`), 2026-11-10
- [x] Prueba del dueño en el proyecto real (2026-11-10): un correo temporal nuevo se rechaza con el texto aprobado y su correo entra normal. La cuenta `prueba@mailinator.com`, creada antes de activar el hook, se borró (no había votado; los buzones de mailinator son públicos). Una consulta de solo lectura confirmó que no queda ninguna otra cuenta con dominio temporal.

### Problemas de la prueba del paso 4 (2026-11-09)
Prueba con la app en `localhost` conectada al proyecto real, correo Hotmail en incógnito y la cuenta de Google abierta en la ventana normal. Sin votar. No se cambió código: falta que el dueño apruebe cada solución.

**Lo que funcionó:** el correo llega desde `no-reply@censounico.com` con la plantilla, un código de 6 dígitos y un enlace. El código crea la cuenta e inicia sesión, y un enlace válido también. Los logs de Auth lo confirman: `/otp` 200 a las 22:57:26 y 23:03:16, y `/verify` 200 a las 23:00:25 (código) y 23:06:10 (enlace).

1. **Alta: no se puede cerrar sesión antes de votar.** El botón solo está en `/user-info`, y esa página solo la ve quien ya votó (`src/lib/auth/access.ts`). En `/cuenta` y en `/votar/tu-nombre` no hay salida. Incumple el Módulo 3, reglas 5 y 7, de `docs/DATOS_INFORMATION.md`. Requiere aprobar el diseño. **Resuelto el 2026-11-10 (aprobado y probado por el dueño):** franja de cuenta fija arriba en `/votar/tu-nombre` y `/cuenta` con menú "¿No eres tú? Cerrar sesión", que lleva a `/votar` (`src/components/layout/account-bar.tsx`).
2. **Alta: el formulario de voto no muestra con qué cuenta se vota.** `/cuenta` no muestra el nombre ni el correo del usuario (`src/app/cuenta/page.tsx`). En la prueba, el dueño no pudo saber si estaba en su cuenta de Gmail o en la de Hotmail. Junto con el problema 1, en un dispositivo compartido alguien puede votar sin darse cuenta con la cuenta de otra persona, y ese voto no se puede cambiar ni borrar. Requiere aprobar el diseño. **Resuelto el 2026-11-10 (probado por el dueño):** la franja dice "Votas con <correo>" y el menú muestra nombre, correo y método. Además, las pestañas se sincronizan (si se cierra sesión en otra, vuelven a `/votar`; si cambia la cuenta, se recargan con un aviso) y el servidor rechaza el voto o el nombre si la cuenta de la sesión no es la que mostraba la pantalla (`cuenta-cambio`). Esto cubre también el problema 6. En la prueba del dueño (2026-11-10) apareció un caso relacionado: una pantalla de registro abierta en otra pestaña no se enteraba de que ya había sesión, y permitía pedir otro correo o volver a abrir Google. Se agregó la misma vigilancia a `/votar` y a "Revisa tu correo", y una comprobación justo antes de pedir el correo, abrir Google, verificar el código o reenviar (`src/lib/auth/use-session-guard.ts`). En la segunda prueba, "Cerrando sesión…" se quedó girando y bloqueó la pestaña: borrar cookies en una Server Function hace que Next.js vuelva a dibujar la página actual, que ya no tiene sesión. El cierre y la consulta de la sesión pasaron a Route Handlers (`/auth/cerrar-sesion`, que solo acepta peticiones del mismo sitio, y `/auth/sesion`), con tiempo límite de 10 segundos.
3. **Resuelto el 2026-11-10 (probado por el dueño): un enlace vencido o ya usado no avisa.** Los logs muestran `/verify` 403 *"One-time token not found"* a las 23:06:18 y 23:08:15: Supabase rechazó el enlace correctamente. La app redirige entonces a `/votar/enlace-vencido`, pero esa página manda a quien ya tiene sesión a su destino (`PAGE_AUDIENCE` en `src/lib/auth/access.ts`), así que el usuario ve el formulario de la sesión abierta en ese navegador en vez de "Enlace no válido". El enlace no da acceso, pero parece que sí. Hace falta mostrar el aviso aunque haya una sesión. **Corregido en el código el 2026-11-10:** "Enlace no válido" se muestra siempre. El mismo día el dueño aprobó bajar la validez del enlace y del código de 60 a 15 minutos (`otp_expiry = 900`); el dueño lo cambió en el panel (y el texto de las plantillas *Magic Link* y *Confirm signup*) ese mismo día. Prueba controlada aprobada: un correo nuevo anula el enlace y el código anteriores, y un enlace de más de 15 minutos se rechaza. También se agregaron dos textos aprobados en "Revisa tu correo": usar siempre el correo más reciente, porque un pedido nuevo anula el enlace y el código anteriores.
4. **Media: el botón "Enviando…" puede quedarse girando para siempre.** En el segundo pedido de correo, Supabase respondió bien (`/otp` 200 a las 23:03:16) y el correo llegó, pero la página nunca pasó a "Revisa tu correo". La falla está en el navegador, después de la respuesta (`router.push` en `src/components/login/login-form.tsx`). La causa exacta no está confirmada: reproducirlo con las herramientas del navegador abiertas (*Console* y *Network*). Además, la página no tiene tiempo límite ni mensaje de error si algo se traba. **Corregido en el código el 2026-11-10 (falta la prueba del dueño):** al enviar el correo, la página pasa a "Revisa tu correo" con una carga completa (`window.location.assign`), como el resto del registro, en vez del cambio de pantalla interno de Next.js. El envío y el reenvío tienen un límite de 15 segundos (`src/lib/auth/with-timeout.ts`): si Supabase no responde, el botón se libera y se muestra el mensaje de error que ya existía. En la prueba del dueño, al volver a "Revisa tu correo" con "atrás" el contador de "Reenviar" empezaba otra vez en 1:00: ahora se guarda en la pestaña la hora del envío y el contador sigue donde iba. Volver a esa pantalla es seguro: no da acceso, y Supabase vence el código a los 15 minutos. Queda para la revisión visual final decidir si la pantalla avisa sola cuando el código venció (necesita un texto aprobado).
5. **Baja, por ahora: el correo llegó a spam en Hotmail.** Causas probables: dominio comprado el mismo día, enlace a `localhost` y logo roto. Volver a revisar en Gmail y Hotmail después de los pasos 7 y 8, en la prueba final (paso 14).
6. **Resuelto el 2026-11-10 junto con el 2: la cuenta de la ventana normal pudo cambiar.** Si el enlace válido de las 23:06:10 se abrió en la ventana normal, esa ventana pasó de la cuenta de Gmail a la de Hotmail sin aviso. Es el comportamiento normal de un enlace de acceso, pero sin los problemas 1 y 2 resueltos el usuario no se entera.

## Catálogo de clubes

- [x] Carga de 95 clubes de Serie A y Serie B hasta 2026 (`20261106130000_cargar_clubes.sql`)
- [x] Revisión de la lista por el dueño (aprobada el 2026-11-06)
- [ ] Color de Tungurahua SC (gris provisional `#9CA3AF`)
- [ ] Decidir si el blanco de Liga de Quito y Norte América es un problema en el mapa (el dueño lo verá más adelante)
- [ ] Archivos de escudo en `public/images/escudos/` (4 de los 95: Emelec, Barcelona, El Nacional y Liga de Quito; falta Chacaritas para el Top 5)

Decisiones de carga, tomadas por Claude según `docs/DATOS_INFORMATION.md`:
- **Alcance:** clubes del campeonato nacional, sin los que solo jugaron torneos provinciales.
- **Fuentes:** anexos de participantes de Wikipedia en español, `ligapro.ec` para Serie A y B 2026, y fichas de cada club y RSSSF para los colores. Son fuentes de referencia, no registros de la FEF.
- **Provincia:** es solo un dato de orden, sin ningún efecto en el sistema; cualquier persona puede votar por cualquier club. Se usa la de origen o sede histórica, y Luq-San queda sin provincia.
- **Color:** Emelec, Barcelona, El Nacional y Liga de Quito usan el de la referencia de diseño. Si el club usa camiseta blanca, se toma su color distintivo, salvo Liga de Quito y Norte América.
- **Nombre oficial:** el nombre habitual de la institución, sin el prefijo legal largo.

## Fuera de esta etapa

- Pantallas de login y de votación
- Protección contra bots y correo propio
- Conectar la Página Principal a los datos reales
