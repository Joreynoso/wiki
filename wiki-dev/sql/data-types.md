## Tipos de datos en PostgreSQL

En PostgreSQL los campos de una tabla pueden tener distintos tipos de variables. Los más comunes son:

### Tipos numéricos

- SMALLINT → Entero pequeño (–32,768 a 32,767).
- INTEGER (o INT) → Entero estándar (–2,147,483,648 a 2,147,483,647).
- BIGINT → Entero grande (muy usado para claves primarias autoincrementales).
- NUMERIC(p,s) → Números decimales exactos, con precisión definida (ideal para dinero).
- DECIMAL(p,s) → Igual que NUMERIC.
- REAL → Número de coma flotante de 4 bytes (menos preciso).
- DOUBLE PRECISION → Número de coma flotante de 8 bytes.
- SERIAL → Entero autoincremental (se suele usar en claves primarias).

### Tipos de texto y cadenas

- CHAR(n) → Cadena de longitud fija.
- VARCHAR(n) → Cadena de longitud variable con límite.
- TEXT → Cadena de longitud ilimitada.

### Tipos de fecha y hora

- DATE → Solo fecha (AAAA-MM-DD).
- TIME → Solo hora (HH:MM:SS).
- TIMESTAMP → Fecha y hora.
- TIMESTAMPTZ → Fecha y hora con zona horaria.
- INTERVAL → Período de tiempo (ej. 1 día, 2 meses).

### Tipos booleanos y misceláneos

- BOOLEAN → Verdadero (TRUE) o falso (FALSE).
- UUID → Identificador único universal.
- JSON y JSONB → Almacenan datos en formato JSON (muy usado en apps modernas).
- BYTEA → Datos binarios (ej. imágenes, archivos).
- ARRAY → Vectores o listas de valores del mismo tipo.

## Modificadores y restricciones (constraints)

Son reglas que se aplican a las columnas para controlar la validez y unicidad de los datos.

- PRIMARY KEY → Define la clave primaria de la tabla (única e identificadora).
- FOREIGN KEY → Define relación con otra tabla.
- UNIQUE → El valor de la columna no puede repetirse.
- NOT NULL → El valor no puede ser nulo.
- DEFAULT valor → Asigna un valor por defecto si no se especifica.
- CHECK (condición) → Define una condición que los datos deben cumplir.
- AUTO_INCREMENT / SERIAL (en PostgreSQL: SERIAL) → Incrementa automáticamente en cada inserción.