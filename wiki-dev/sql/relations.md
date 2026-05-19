## Topología de Relaciones en SQL

Las relaciones definen cómo se conectan los datos entre diferentes tablas utilizando claves.

### Uno a Uno (1:1)
- **Concepto**: Relación de exclusividad.
- **¿Qué es?**: Un registro de la Tabla A se conecta con **un solo** registro de la Tabla B, y viceversa.
- 📌 **Ejemplo**: Un `Usuario` y su `Configuración de Cuenta`. Cada usuario tiene una única configuración, y esa configuración pertenece a un único usuario.

### Uno a Muchos (1:N)
- **Concepto**: Relación de jerarquía o propiedad.
- **¿Qué es?**: Un registro de la Tabla A se conecta con **varios** registros de la Tabla B. Pero cada registro de B pertenece solo a uno en A.
- 📌 **Ejemplo**: Un `Cliente` y sus `Facturas`. Un cliente puede tener muchísimas facturas, pero una factura específica le pertenece a un solo cliente. (Es la relación más común).

### Muchos a Muchos (N:M)
- **Concepto**: Red cruzada.
- **¿Qué es?**: Múltiples registros de la Tabla A se conectan con múltiples registros de la Tabla B. (En SQL, esto requiere crear una tercera "tabla intermedia" para unirlos).
- 📌 **Ejemplo**: `Alumnos` y `Clases`. Un alumno asiste a muchas clases diferentes, y una clase tiene muchos alumnos diferentes inscritos en ella.