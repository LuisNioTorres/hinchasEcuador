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

Pospuesta por el dueño el 2026-11-06: las vistas se verán más adelante. Sigue por decidir si los clubes con 0 votos aparecen en los rankings.

- [ ] Las 5 vistas de rankings
- [ ] Desempate alfabético y porcentajes correctos
- [ ] Las vistas no revelan datos de los votantes

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

## Catálogo de clubes

- [x] Carga de 95 clubes de Serie A y Serie B hasta 2026 (`20261106130000_cargar_clubes.sql`)
- [x] Revisión de la lista por el dueño (aprobada el 2026-11-06)
- [ ] Color de Tungurahua SC (gris provisional `#9CA3AF`)
- [ ] Decidir si el blanco de Liga de Quito y Norte América es un problema en el mapa (el dueño lo verá más adelante)
- [ ] Archivos de escudo en `public/images/escudos/` (aún no existen)

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
