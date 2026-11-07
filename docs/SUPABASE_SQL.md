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
| Entorno de pruebas | Docker Desktop local, aún sin instalar |

Los ajustes de Data API y Automatic RLS constan por lo que informó el dueño desde el panel. Faltan confirmarlos en el proyecto real.

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
| 11 | Pruebas | Las pruebas de seguridad se hacen en Docker Desktop local, sin tocar el proyecto real ni dejar votos de prueba. Se necesita antes de la Fase 2. |

## Riesgos abiertos de la auditoría (2026-11-06)

Se resuelven en la fase indicada, cuyo diseño debe aprobar el dueño.

| Riesgo | Fase |
| :--- | :--- |
| La clave secreta del servidor salta RLS: hace falta un bloqueo real contra cambios y borrados de votos | 2 |
| `ha_votado` y el voto deben actualizarse en una sola operación | 2 |
| Definir qué pasa con el perfil al borrar una cuenta que no votó | 2 |
| Las vistas deben leer `votos` sin abrirla al público; documentar la excepción ante el asesor de Supabase | 3 |
| Definir qué entregan 3 de las vistas y si aparecen los clubes con 0 votos; agregar índices y medir | 3 |
| Bloquear el cambio de correo en Supabase Auth, para evitar votar otra vez con el correo anterior | Login |
| Una persona puede votar varias veces usando varios correos | Antes del lanzamiento |
| Un administrador puede ver quién votó por quién desde el panel; incluirlo en la revisión legal | Antes del lanzamiento |

## Checklist

### Fase 0: Preparación
- [x] Proyecto creado en Supabase y conectado con Next.js
- [x] Decisiones 1 a 11 tomadas
- [x] Documentos corregidos (auditoría del 2026-11-06)
- [ ] Cambios guardados en GitHub (commit del dueño)
- [ ] Forma de aplicar las migraciones configurada (el dueño inicia sesión y enlaza el proyecto)
- [ ] Ajustes de seguridad confirmados en el proyecto real
- [ ] Diseño de las tablas de catálogos aprobado por el dueño
- [ ] Docker Desktop instalado (antes de la Fase 2)

### Fase 1: Catálogos
- [ ] Tablas de continentes, provincias, cantones y clubes
- [ ] Reglas de lectura pública
- [ ] Carga de continentes, provincias y cantones, con sus fuentes
- [ ] Revisión de los datos cargados por el dueño

### Fase 2: Usuarios y votos
- [ ] Tabla `profiles`, creada automáticamente con cada cuenta
- [ ] Tabla `votos` con voto único y ubicación válida
- [ ] Reglas RLS: votos inmodificables y privados

### Fase 3: Resultados
- [ ] Las 5 vistas de rankings
- [ ] Desempate alfabético y porcentajes correctos
- [ ] Las vistas no revelan datos de los votantes

### Fase 4: Pruebas
- [ ] Un visitante no puede votar ni leer votos individuales
- [ ] Un usuario no puede votar dos veces, ni editar o borrar su voto
- [ ] Nadie puede cambiar un voto, ni siquiera con la clave secreta del servidor
- [ ] Un usuario no puede escribir en los catálogos ni ver o editar perfiles ajenos
- [ ] Un usuario no puede cambiar su `email` ni `ha_votado`, y su perfil queda bloqueado al votar
- [ ] Un cantón de otra provincia es rechazado
- [ ] Una cuenta que ya votó no se puede borrar
- [ ] Revisión con el asesor de seguridad de Supabase
- [ ] Lint y build correctos

## Fuera de esta etapa

- Carga de clubes
- Pantallas de login y de votación
- Protección contra bots y correo propio
- Conectar la Página Principal a los datos reales
