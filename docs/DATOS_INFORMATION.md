## 1. Modulo geografico
"2.Reglas de Negocio
- Usuarios en Ecuador: Solo podran seleccionar su provincia y su cantón, nada mas (No parroquias ni ciudades)
- **Usuarios Internacionales:** Deben seleccionar únicamente **Continente** (América del Norte, América del Sur, Europa, Asia, África, Oceanía, Antártida)."
- **Relación Provincia-Cantón:** La relación entre provincias y cantones de Ecuador se investigará en fuentes oficiales. Cuando el usuario seleccione una provincia, únicamente aparecerán los cantones que pertenezcan a ella. No deben mezclarse cantones de otras provincias.
3. Estrcutura de datos recomendada.
"1. `continentes`
   - `id`: UUID / INT (PK)
   - `nombre`: TEXT (Ej. ""América del Sur"", ""Europa"")

2. `provincias`
   - `id`: UUID / INT (PK)
   - `nombre`: TEXT (Ej. ""Guayas"", ""Pichincha"", ""Manabí"")
   - `codigo_iso`: TEXT (Opcional, ej. ""EC-G"")

3. `cantones`
   - `id`: UUID / INT (PK)
   - `provincia_id`: FK -> `provincias(id)`
   - `nombre`: TEXT (Ej. ""Guayaquil"", ""Quito"", ""Cuenca"", ""Manta"")"

## Módulo 2: Catálogo de Clubes de Fútbol

### 1. Reglas de Negocio
- **Criterio de Elegibilidad:** El catálogo incluye a todos los clubes profesionales del Ecuador (LigaPro Serie A y Serie B), así como a clubes históricos y de Segunda Categoría que hayan competido en el fútbol profesional en algún momento.
- **Identidad Visual Unificada:** Cada club tendrá asignado un único color primario en código hexadecimal (HEX) para colorear mapas y gráficos, y una única imagen oficial de su escudo.
- **Nombres de Referencia:** Se mantendrá un nombre oficial de registro y un nombre popular/corto con el que se le identificará permanentemente en toda la interfaz web.
- **Identidad e Historial de los Clubes:** Claude tiene libertad para investigar en Internet y elegir el nombre más famoso, representativo e históricamente reconocido de cada club, especialmente si ha cambiado de nombre a lo largo de su historia. Puede tomar decisiones propias fundamentadas sin consultar cada caso al dueño del proyecto, quien revisará posteriormente la lista y corregirá cualquier error que encuentre.
- **Desempate en Rankings:** Si dos o más equipos empatan en cantidad exacta o porcentaje de votos dentro de cualquier ámbito (nacional, provincial, cantonal o continental), el criterio estricto de desempate será **alfabético por su nombre popular**.

### 2. Estructura de Datos (Tabla: `clubes`)

| Campo | Tipo de Dato | Restricción | Descripción / Ejemplo |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Identificador único del club en base de datos. |
| `slug` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Código/identificador único en texto para URLs y CSS (Ej: `emelec`, `barcelona`, `liga-quito`). |
| `nombre_oficial` | `VARCHAR(150)` | `NOT NULL` | Nombre legal o de registro del club (Ej: `CLUB SPORT EMELEC`). |
| `nombre_popular` | `VARCHAR(100)` | `NOT NULL` | Nombre corto con el que se mostrará en la web (Ej: `EMELEC`). |
| `color_hex` | `VARCHAR(7)` | `NOT NULL` | Código de color hexadecimal único para mapas y gráficos (Ej: `#0055A5`). |
| `escudo_url` | `VARCHAR(255)` | `NOT NULL` | Ruta relativa del archivo del escudo almacenado en el proyecto (Ej: `/images/escudos/emelec.png`). |
| `provincia_id` | `UUID` | `FOREIGN KEY` -> `provincias(id)` | Provincia de origen o sede histórica del club. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Fecha y hora de registro del club en la plataforma. |

## Módulo 3: Usuarios, Autenticación y Registro Express

### 1. Reglas de Negocio
- **Autenticación Intuitiva y Sencilla:** El ingreso se realiza mediante Supabase Auth ofreciendo botón de inicio de sesión con Google (Google Auth) o correo electrónico. Sin procesos complejos de contraseñas ni códigos de verificación manual.
- **Registro con Cualquier Correo Electrónico:** El usuario podrá registrarse con cualquier correo electrónico válido, ya sea Gmail, Hotmail, Outlook u otro proveedor, como se hace normalmente en plataformas modernas y profesionales. No se obligará al usuario a crear contraseñas ni se implementarán procesos complicados: el registro y la verificación deben ser rápidos, sencillos e intuitivos. El funcionamiento será el siguiente:
  1. El usuario introduce su correo electrónico.
  2. La plataforma le envía un correo de verificación para comprobar que realmente tiene acceso a esa dirección.
  3. El usuario verifica su correo mediante el enlace recibido.
  4. Una vez verificado, puede ingresar a la plataforma y utilizarla normalmente.
- **Datos Mínimos:** Únicamente se requiere el correo electrónico y el nombre/apellido básico al momento de autenticarse. No se solicitan datos innecesarios (sin cédula, sin teléfono, sin dirección).
- **Flujo en Dos Pasos:**
  1. El usuario hace clic en **VOTAR** y se autentica de forma transparente.
  2. Al ingresar, accede al formulario express donde selecciona su **Ubicación** (Provincia y Cantón para Ecuador, o Continente para internacional) y su **Equipo de Fútbol**.
- **Procesamiento Inmediato:** Al hacer clic en el botón "Enviar Voto", el voto se registra y se suma **de inmediato** a las estadísticas generales sin pasos intermedios.
- **Inmutabilidad Absoluta (Bloqueo Total):** Una vez emitido el voto, **NO se podrá modificar ni editar ningún dato** (ni el equipo seleccionado, ni la provincia, cantón o continente). El perfil queda bloqueado para garantizar la integridad del censo.

---

### 2. Estructura de Datos (Tabla: `profiles` / `usuarios`)

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `REFERENCES auth.users(id)` | Identificador vinculado a la cuenta de autenticación de Supabase. |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Correo electrónico verificado por la plataforma. |
| `nombre_completo`| `VARCHAR(150)` | `NULLABLE` | Nombre y apellido del usuario proporcionados en el registro/OAuth. |
| `ha_votado` | `BOOLEAN` | `DEFAULT false` | Bandera de control para saber si ya completó su proceso de votación. |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Fecha y hora de creación del usuario. |

## Módulo 4: Votación e Integridad de Datos

### 1. Reglas de Negocio
- **Unicidad Absoluta (Un voto por persona):** Cada usuario registrado en `auth.users` puede registrar exactamente un (1) solo voto en todo el sistema. Esta restricción se aplica estrictamente a nivel de base de datos con un índice único `UNIQUE(usuario_id)`.
- **Lógica de Ubicación Exclusiva (Mutuamente Excluyente):**
  - **Voto en Ecuador:** Almacena obligatoriamente `provincia_id` y `canton_id`. El campo `continente_id` se registra como `NULL`.
  - **Voto Internacional:** Almacena obligatoriamente `continente_id`. Los campos `provincia_id` y `canton_id` se registran como `NULL`.
- **Congelamiento de Ubicación Histórica (Denormalización):** Los datos geográficos se guardan de forma permanente directamente en el registro del voto en el momento en que se emite.
- **Independencia de la Ubicación Física:** La ubicación física del usuario NO importa y puede encontrarse en cualquier lugar del mundo. No se debe solicitar, acceder ni almacenar su geolocalización. La ubicación histórica del voto se maneja según los criterios de este documento, sin depender de dónde se encuentre físicamente la persona.
- **Inmutabilidad y Permisos RLS (Row Level Security):**
  - **Insert:** Permitido solo una vez por usuario autenticado.
  - **Update y Delete:** Estrictamente prohibidos mediante políticas RLS en PostgreSQL. Ningún usuario ni la interfaz pueden editar o eliminar un voto emitido.
- **Protección contra Bots en la Votación (CAPTCHA):** La votación incorporará protección contra bots mediante Cloudflare Turnstile (preferentemente) o Google reCAPTCHA v3.
  - La protección debe funcionar de manera prácticamente invisible. Solo se activará una verificación adicional cuando existan indicios de actividad sospechosa.
  - Los usuarios legítimos NO deben tener que seleccionar imágenes, resolver acertijos ni superar verificaciones molestas cada vez que voten.
  - La prioridad es proteger la plataforma sin perjudicar la experiencia de los usuarios reales.

---

### 2. Estructura de Datos (Tabla: `votos`)

| Campo | Tipo de Dato | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Identificador único del registro de voto. |
| `usuario_id` | `UUID` | `UNIQUE`, `NOT NULL`, `REFERENCES auth.users(id)` | Identificador del usuario que votó (garantiza 1 voto por cuenta). |
| `club_id` | `UUID` | `NOT NULL`, `REFERENCES clubes(id)` | Club de fútbol seleccionado por el usuario. |
| `continente_id`| `UUID` | `NULLABLE`, `REFERENCES continentes(id)` | Continente de residencia para usuarios internacionales (NULL si es Ecuador). |
| `provincia_id` | `UUID` | `NULLABLE`, `REFERENCES provincias(id)` | Provincia de residencia para usuarios en Ecuador (NULL si es Internacional). |
| `canton_id` | `UUID` | `NULLABLE`, `REFERENCES cantones(id)` | Cantón/Ciudad de residencia para usuarios en Ecuador (NULL si es Internacional). |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now()`, `NOT NULL` | Timestamp exacto de emisión del voto para auditoría y orden histórico. |

---

### 3. Restricciones e Integridad SQL (Constraints)

1. **Restricción de Integridad Geográfica (`CHECK Constraint`):**
   ```sql
   CONSTRAINT check_ubicacion_valida CHECK (
     (continente_id IS NOT NULL AND provincia_id IS NULL AND canton_id IS NULL) OR
     (continente_id IS NULL AND provincia_id IS NOT NULL AND canton_id IS NOT NULL)
   )

## Módulo 5: Vistas de Resultados y Rankings

### 1. Reglas de Negocio
- **Acceso Público:** Los resultados, rankings y mapas son de acceso libre y público. No requieren inicio de sesión para ser consultados.
- **Transparencia y Porcentajes:** Los porcentajes mostrados en la interfaz se calculan dinámicamente sobre el total de votos válidos del ámbito territorial consultado:
  $$\text{Porcentaje} = \left( \frac{\text{Votos del Club en Ámbito}}{\text{Total Votos del Ámbito}} \right) \times 100$$
- **Criterio Estricto de Desempate:** En caso de empate exacto en cantidad o porcentaje de votos entre dos o más clubes, el orden de despliegue en las tablas de resultados se resolverá **alfabéticamente por el `nombre_popular` del club**.
- **Lógica de Coloreado del Mapa Interactivo (Ecuador):**
  - Cada provincia del mapa SVG se pintará dinámicamente con el `color_hex` del club que ocupe el **1.er lugar (líder)** en cantidad de votos en dicha provincia.
  - Si una provincia aún no registra votos, se coloreará con un tono neutro/place-holder (`#E5E7EB` o el crema base de la plataforma).

---

### 2. Especificación Técnica de Vistas en PostgreSQL (`VIEWS`)

Para garantizar consultas ultrarrápidas y sin sobrecargar la base de datos, las estadísticas se estructuran mediante vistas SQL especializadas:

1. **`vista_ranking_nacional`**
   - Agrupa y suma los votos por `club_id` donde `provincia_id IS NOT NULL`.
   - Entrega: `club_id`, `nombre_popular`, `color_hex`, `escudo_url`, `total_votos`, `porcentaje_nacional` y `posicion_ranking`.

2. **`vista_ranking_provincial`**
   - Agrupa los votos por `provincia_id` y `club_id`.
   - Entrega el desglose completo de posiciones por equipo dentro de cada una de las 24 provincias de Ecuador.

3. **`vista_lideres_provinciales` (Mapa Interactivo)**
   - Utiliza la función de ventana `ROW_NUMBER() OVER (PARTITION BY provincia_id ORDER BY total_votos DESC, nombre_popular ASC)`.
   - Asigna a cada provincia exclusivamente los datos del club en **posición 1**, entregando la provincia, el `color_hex` del líder y su porcentaje de dominio.

4. **`vista_ranking_cantonal`**
   - Agrupa los votos por `canton_id` y `club_id` para permitir filtros de alta precisión a nivel de ciudad/cantón.

5. **`vista_ranking_continental`**
   - Agrupa los votos por `continente_id` y `club_id` para mostrar las preferencias de la comunidad de ecuatorianos en el exterior.

## Módulo 6: Administración, Seguridad y Auditoría (Políticas RLS)

### 1. Reglas de Negocio y Seguridad
- **Protección a Nivel de Fila (Row Level Security - RLS):** Todas las tablas de la base de datos tendrán RLS activado obligatoriamente (`ENABLE ROW LEVEL SECURITY`). Ninguna tabla estará expuesta sin políticas de acceso controlado.
- **Acceso Público de Lectura:** Las tablas de catálogos (`continentes`, `provincias`, `cantones`, `clubes`) y las vistas de estadísticas/rankings tienen permisos de lectura pública (`SELECT`) para cualquier usuario, esté autenticado o no.
- **Privacidad y Control de Usuarios:** 
  - Un usuario autenticado solo puede leer y modificar su propio registro en la tabla de perfiles (`auth.uid() = id`).
- **Inmutabilidad Absoluta del Voto:**
  - **INSERT:** Permitido únicamente para usuarios autenticados que cumplan con la condición de no haber registrado un voto previo (`ha_votado = false` o que no exista un registro previo con su `usuario_id`).
  - **UPDATE / DELETE:** Estrictamente prohibidos para los roles de usuario público (`authenticated` y `anon`). Nadie puede modificar ni eliminar un voto una vez emitido, protegiendo la integridad del censo.

---

### 2. Políticas de Seguridad RLS en PostgreSQL (Ejemplo de Implementación)

1. **Política de Lectura Pública para Clubes y Geografía:**
   ```sql
   CREATE POLICY "Lectura pública de clubes" ON clubes FOR SELECT USING (true);
   CREATE POLICY "Lectura pública de provincias" ON provincias FOR SELECT USING (true);
   CREATE POLICY "Lectura pública de cantones" ON cantones FOR SELECT USING (true);
   CREATE POLICY "Lectura pública de continentes" ON continentes FOR SELECT USING (true);
Política de Inserción de Voto Único (Usuario Autenticado):

SQL
CREATE POLICY "Usuario autenticado puede emitir un único voto" ON votos
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = usuario_id AND
  NOT EXISTS (
    SELECT 1 FROM votos WHERE votos.usuario_id = auth.uid()
  )
);
Bloqueo Total de Modificación y Eliminación de Votos:

SQL
-- No se crean políticas de UPDATE ni DELETE para usuarios, por lo que por defecto están prohibidas.