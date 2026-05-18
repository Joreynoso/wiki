## Integridad y normalización

¿Qué es? Es un proceso para organizar los datos de una base de datos de manera que se minimice la redundancia y se mejore la integridad de los datos. Busca asegurar que los datos sean consistentes, precisos y no redundantes.

## El problema de no normalizar

**Desventajas:**
* La redundancia de datos, genera mayor espacio de almacenamiento y mayor tiempo de procesamiento.
* La anomalia de actualización, si se tiene que actualizar un dato, se debe actualizar en todos los registros donde se encuentra.
* La anomalia de inserción, no se puede insertar un dato si no se tiene todos los datos necesarios.
* La anomalia de eliminación, no se puede eliminar un dato si no se tiene todos los datos necesarios.

## Formas normales

### 1FN (Primera Forma Normal)
- **Objetivo**: Eliminar grupos repetitivos.
- **Regla**: Cada celda debe contener un solo valor atómico (no puede ser una lista). Cada fila debe ser única.

### 2FN (Segunda Forma Normal)
- **Requisito**: Debe cumplir 1FN.
- **Objetivo**: Evitar mezclar información cuando tu tabla se identifica usando dos o más columnas juntas (clave compuesta).
- **Regla (en simple)**: Si tu fila se identifica uniendo `Columna A` + `Columna B`, **todo** el resto de los datos de esa fila debe depender de **ambas** cosas a la vez, no solo de la A o solo de la B.

### 3FN (Tercera Forma Normal)
- **Requisito**: Debe cumplir 2FN.
- **Objetivo**: Evitar dependencias "en cadena" o indirectas.
- **Regla (en simple)**: Si un dato depende de otro dato normal (no clave) de la tabla, debes sacarlo a otra tabla. Toda la información debe depender directa y únicamente de la clave principal.

📌 **Ejemplos súper sencillos:**
* ❌ **Rompe la 1FN (Múltiples datos):** Tener una columna "Teléfonos" y guardar `1111, 2222, 3333` todos amontonados en la misma celda. (Solución: Solo un número por celda).
* ❌ **Rompe la 2FN (Depende solo de una parte):** Tu tabla es "Detalle de Venta" y se identifica por `[Nro_Factura + ID_Producto]`. Si en esa fila guardas también el `Nombre_del_Producto`, está mal. El nombre del producto solo tiene que ver con el Producto, no le importa la Factura. (Solución: Mueve el nombre a una tabla separada de "Productos").
* ❌ **Rompe la 3FN (Depende de un tercero):** En tu tabla "Alumnos", guardas al alumno y también anotas su `ID_Carrera` y el `Nombre_de_la_Carrera`. Está mal, porque el nombre de la carrera depende del ID de la carrera, no directamente del alumno. (Solución: Mueve los nombres de las carreras a una tabla "Carreras").


*Las entidades de datos no existen en el vacio. Las bases de datos relacionales utilizaun
un mapeo estricto para definir como interactuan las entidades entre si, sin fusionar datos, para tener un mejor control sobre los datos.*