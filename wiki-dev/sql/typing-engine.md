## Typing Engine: PostgreSQL Specifications

PostgreSQL organiza sus tipos de datos en distintos módulos para optimizar el almacenamiento y el rendimiento.

### Módulo Numérico
Para cálculos matemáticos y contadores.
- **Enteros:** `SMALLINT`, `INT`, `BIGINT`.
- **Decimales:** `NUMERIC`, `DECIMAL`, `REAL`.
- **Autoincrementales:** `SERIAL`.

### Módulo de Texto
Para almacenar caracteres y palabras.
- **`CHAR`**: Longitud estrictamente fija.
- **`VARCHAR`**: Longitud variable, pero con un límite máximo.
- **`TEXT`**: Longitud ilimitada.

### Módulo Temporal
Para rastrear el tiempo y eventos.
- **`DATE`**: Únicamente fecha (día, mes, año).
- **`TIME`**: Únicamente hora exacta.
- **`TIMESTAMP`**: Fecha y hora combinadas (ideal para sincronización).

### Módulo Lógico y Estructural
Para datos avanzados y control de flujo.
- **`BOOLEAN`**: Estados binarios (verdadero o falso).
- **`UUID`**: Identificadores únicos universales e irrepetibles.
- **`JSON` / `ARRAY`**: Estructuras de datos complejas o listas.

## El escudo de integridad: Restricciones (Constraints)

Son reglas que definen qué datos son válidos y cómo se relacionan las tablas.

### Restricciones de Columna
- **`NOT NULL`**: Prohíbe valores vacíos.
- **`UNIQUE`**: Asegura que todos los valores sean distintos.
- **`PRIMARY KEY`**: Identificador único de la tabla.
- **`DEFAULT`**: Valor predeterminado si no se especifica uno.
- **`CHECK`**: Condición personalizada (ej: `edad > 18`).

### Restricciones de Tabla (Relacionales)
- **`FOREIGN KEY` (FK)**: Vincula una tabla con otra, asegurando la integridad referencial (solo permite valores que existan en la tabla referenciada).

### Síntesis: el blueprint perfecto

- **Estructura**: Tablas purificadas con 3FN.
- **Conexión**: Relaciones establecidas mediante claves exactas.
- **Integridad**: Datos fuertemente tipados y blindados con restricciones.
- **Operatividad**: Conjuntos matemáticos listos para extraer métricas.

---

### 📌 Ejemplo práctico en acción (4 tablas)

Imagina un pequeño sistema de tienda para ver todo esto integrado de forma conceptual:

1. **`Usuarios`**:
   - `id`: `SERIAL PRIMARY KEY` (Autoincremental y único).
   - `email`: `VARCHAR(255) UNIQUE NOT NULL` (Texto con límite, no se repite, es obligatorio).
   - `activo`: `BOOLEAN DEFAULT true` (Binario, verdadero por defecto).

2. **`Productos`**:
   - `id`: `SERIAL PRIMARY KEY`.
   - `nombre`: `VARCHAR(100) NOT NULL`.
   - `precio`: `NUMERIC(10,2) CHECK (precio > 0)` (Decimal exacto para dinero, prohíbe precios negativos).

3. **`Pedidos`**:
   - `id`: `SERIAL PRIMARY KEY`.
   - `usuario_id`: `INT FOREIGN KEY` (Se relaciona con un `Usuario`).
   - `fecha_compra`: `TIMESTAMP DEFAULT NOW()` (Guarda el instante exacto de la compra).

4. **`Detalle_Pedidos`** (Tabla intermedia N:M):
   - `pedido_id`: `INT FOREIGN KEY` (Relación al `Pedido`).
   - `producto_id`: `INT FOREIGN KEY` (Relación al `Producto`).
   - `cantidad`: `SMALLINT CHECK (cantidad > 0)` (Número pequeño, obliga a comprar al menos 1).
   - *Su clave*: `PRIMARY KEY (pedido_id, producto_id)` (Clave compuesta).