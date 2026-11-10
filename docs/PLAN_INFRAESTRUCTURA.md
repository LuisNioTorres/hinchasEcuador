# Plan maestro de infraestructura y despliegue

Versión del 2026-11-09. Es la fuente oficial para publicar y hacer crecer el Censo Único del Ecuador. Las decisiones de base de datos siguen en `docs/SUPABASE_SQL.md`, y las reglas del producto en `docs/DATOS_INFORMATION.md`.

Los precios y límites marcados con **(verificar)** salen de guías de terceros. Se confirman en la página oficial antes de contratar.

## 1. Decisiones fijas

| Tema | Decisión |
| :--- | :--- |
| Proyecto | Censo del club de fútbol más popular de Ecuador, administrado por una sola persona |
| Presupuesto | Máximo $15–20 al mes |
| Público inicial esperado | Unas 300 personas |
| Publicidad | Ninguna hasta que la página crezca mucho. El plan gratis de Vercel prohíbe el uso comercial, AdSense incluido. |
| Dominio | `censounico.com`, comprado en Cloudflare Registrar, con renovación automática |
| Hosting | Vercel, plan gratis (Hobby) |
| Base de datos y login | Supabase, plan gratis. Google como acceso principal; correo con enlace y código como alternativa |
| Envío de correos | Resend, plan gratis |
| Protección contra bots | Cloudflare Turnstile, gratis |
| Código | GitHub. Vercel publica automáticamente cada cambio en `main`. |
| Revisión visual | El dueño revisa toda la aplicación antes del lanzamiento; solo se corrigen detalles de frontend. |

## 2. Cómo se conectan las piezas

```text
                 censounico.com (Cloudflare: dominio y DNS)
                              │
   Usuario ──────────────────►│
   (teléfono o PC)            ▼
                     Vercel: la página web
                      │   - muestra resultados guardados en caché
                      │   - registra el voto desde el servidor
                      │   - Turnstile filtra bots
                      ▼
                     Supabase: base de datos y login
                      │   - votos, perfiles y rankings
                      │   - un voto por cuenta, garantizado
                      ├──► Google: "Continuar con Google" (no envía correos)
                      └──► Resend ──► Gmail / Hotmail / Outlook del usuario
                                      (correo con enlace y código)
```

- **Cloudflare:** la dirección `censounico.com` y la verificación anti-bots.
- **Vercel:** sirve la página y ejecuta la lógica del servidor.
- **Supabase:** guarda los datos, decide quién puede entrar y genera los códigos.
- **Resend:** solo transporta los correos que escribe Supabase.

## 3. Costos

| Concepto | Pago inicial | Mensual | Notas |
| :--- | :--- | :--- | :--- |
| Dominio `censounico.com` | ~$11 | — | Se renueva cada año por ~$11 **(verificar)** |
| Vercel Hobby | $0 | $0 | Sin anuncios. Si supera su cupo, **pausa la página**: no cobra. |
| Supabase Free | $0 | $0 | Sin copias automáticas; se pausa tras 7 días sin actividad. |
| Resend Free | $0 | $0 | 3.000 correos al mes y 100 al día **(verificar)** |
| Cloudflare Turnstile | $0 | $0 | |
| **Total del lanzamiento** | **~$11** | **~$1** | El dominio, repartido en el año |

Costos posibles solo si el proyecto crece (sección 7): Vercel Pro (~$20 al mes), Resend Pro (~$20 al mes) y Supabase Pro (~$25 al mes) **(verificar)**.

## 4. Capacidad

| Acción | Qué consume | Con 300–500 personas |
| :--- | :--- | :--- |
| Ver resultados | Casi nada: se entrega una copia en caché y la base no trabaja por cada visita | Sobra |
| Votar | Una escritura pequeña en la base | Sobra; probado con 20 votos simultáneos y más de 6.000 votos |
| Entrar con Google | Google y Supabase, sin correo | Sobra |
| Entrar con correo | 1 correo por acceso | **Límite real: 100 al día** |

Con este volumen, el riesgo no es la potencia sino los **cupos de los planes gratis**. La sección 6 dice cómo vigilarlos.

## 5. Seguridad y protección de votos

**Ya implementado y probado:**
- Un voto por cuenta, garantizado por la base de datos, también con votos simultáneos.
- El voto se registra en el servidor; nadie puede editarlo ni borrarlo desde la página.
- Los votos individuales son privados; solo se publican totales.
- El correo de una cuenta no se puede cambiar, para que nadie lo libere y vote de nuevo.
- Las páginas privadas se protegen en el servidor.

**Obligatorio antes del lanzamiento:**
1. Turnstile en el envío del voto y en la solicitud de códigos por correo.
2. Límite de correos de Supabase ajustado a 100 por hora (*Authentication → Rate Limits*), gratis.
3. Primera copia de seguridad manual (sección 8).

**Puede esperar:** bloquear correos desechables, la protección avanzada de Cloudflare y las copias automáticas de Supabase Pro.

**Riesgo aceptado:** una persona con varios correos puede votar varias veces. Impedirlo exigiría cédula u otro dato personal, y eso va contra la regla de pedir datos mínimos. Turnstile frena el abuso automático, no a una persona real con varias cuentas.

## 6. Monitoreo: cómo saber si estás al borde

| Panel | Dónde mirar | Qué vigilar |
| :--- | :--- | :--- |
| **Vercel** | Proyecto → **Usage** | Porcentaje de cada cupo mensual, sobre todo transferencia de datos y ejecución de funciones |
| **Supabase** | Proyecto → **Usage** | Transferencia de datos (egress), tamaño de la base y usuarios activos |
| **Resend** | Panel → envíos del día | Correos enviados hoy y en el mes |
| **Supabase** | **Authentication → Logs** | Errores de envío de correo, intentos rechazados |

**Frecuencia:**
- **Sin campaña:** una vez por semana.
- **Días de promoción o si hay mucho movimiento:** dos veces al día.

**Umbrales:**
- **🟢 Menos del 50 %:** normal.
- **🟡 50 %:** prepara el cambio de la sección 7 y revisa a diario.
- **🔴 80 %:** aplica el cambio ese mismo día. En Vercel Hobby, llegar al 100 % pausa la página.

Al configurar cada servicio, activar los **avisos por correo de uso** que ofrezcan **(verificar disponibilidad en cada panel)**.

## 7. Etapas de crecimiento

| Etapa | Señal para entrar | Cambio | Costo mensual aproximado |
| :--- | :--- | :--- | :--- |
| **1. Lanzamiento** | Inicio | Todo en plan gratis | ~$1 |
| **2. Crecimiento** | Correos cerca de 100 al día | Promover el acceso con Google; Resend Pro solo los meses necesarios | $1–21 |
| **3. Viral** | Vercel o Supabase en 🟡 50 % de su cupo | **Vercel Pro**, para que la página no se pause | $21–41 |
| **4. Escala** | Decenas de miles de votos sostenidos, o Supabase en 🟡 | **Supabase Pro**, con copias automáticas; buscar ingresos (sección 10) | $46–66 |

Las etapas 3 y 4 superan el presupuesto. Solo ocurren si el proyecto funciona, y entonces se cubren con ingresos.

## 8. Copias de seguridad

El plan gratis de Supabase no hace copias automáticas.
- **Manual:** un comando de Supabase CLI desde la laptop guarda la base en un archivo.
- **Cuándo:** antes del lanzamiento, luego cada semana y antes de cualquier cambio en la base.
- **Dónde guardarlas:** en la laptop y en una nube personal.
- Con Supabase Pro (etapa 4), las copias pasan a ser automáticas.

## 9. Contingencia ante picos

| Si pasa esto | Hacer esto |
| :--- | :--- |
| Vercel en 🔴 o la página pausada | Pasar a Vercel Pro en el panel; la página vuelve sin rehacer nada |
| Se agotan los 100 correos del día | Pedir que entren con Google; si se repite, Resend Pro ese mes |
| Supabase en 🔴 | Pasar a Supabase Pro en el panel |
| Ataque de bots | Revisar Turnstile y los registros de acceso de Supabase |
| Error grave en la página | Volver a la publicación anterior desde Vercel → *Deployments* |

Todos los cambios de plan se hacen desde los paneles, sin programar.

## 10. Monetización (futura)

No se monetiza al inicio. Opciones para cuando haya tráfico real:

| Opción | Requisitos | Cuándo tiene sentido |
| :--- | :--- | :--- |
| Botón de donación (Ko-fi, Buy Me a Coffee, PayPal) | Ninguno. Vercel Hobby lo permite. | En cualquier momento, si el dueño lo aprueba |
| Patrocinio de una marca deportiva | Tráfico demostrable, que Vercel Usage permite enseñar | Etapas 3 y 4 |
| Publicidad (AdSense u otra) | Aprobación de Google y Vercel Pro | Solo si el tráfico la justifica |

## 11. Hoja de ruta hasta el lanzamiento

1. ☑ Comprar `censounico.com` en Cloudflare, con renovación automática y privacidad de datos. Comprado el 2026-11-09 por $11.17/año; vence el 2027-11-09.
2. ☑ Crear la cuenta de Resend, verificar el dominio y conectarla a Supabase como SMTP. Hecho el 2026-11-09: dominio verificado en `us-east-1` (DKIM, `send`, `rsend` y DMARC `p=none`), sin seguimiento de clics ni de aperturas, API key de solo envío. Remitente: `Censo Futbolero Único del Ecuador <no-reply@censounico.com>`.
3. ☑ En Supabase, activar la plantilla de correo y subir el límite de correos por hora. Hecho el 2026-11-09: `acceso.html` en *Magic Link* y *Confirm signup*, y 100 correos por hora.
4. ☐ Probar el login por correo en el proyecto real. En curso: el envío, el código y el enlace funcionan, pero la prueba del 2026-11-09 encontró 6 problemas, anotados en `docs/SUPABASE_SQL.md` (*Problemas de la prueba del paso 4*).
5. ☐ Implementar Turnstile en el voto y en la solicitud de códigos.
6. ☐ Publicar en Vercel: variables de entorno, incluida `SUPABASE_SECRET_KEY`, y conexión del dominio.
7. ☐ Actualizar las direcciones del sitio en Supabase y en Google Cloud con `censounico.com`.
8. ☐ Publicar la app de Google, para que entre cualquier persona y no solo los usuarios de prueba.
9. ☐ Revisión con un abogado: borrado de datos y acceso de administradores a los votos.
10. ☐ Quitar las rutas `/simulacion` y dejar la base sin datos de prueba.
11. ☐ Revisión visual completa del dueño y sus correcciones de frontend.
12. ☐ Prueba final completa en `censounico.com`, con un voto real.
13. ☐ Primera copia de seguridad.
14. ☐ Registrar el sitio en Google Search Console.
15. ☐ Lanzamiento y promoción en redes, vigilando la sección 6.
