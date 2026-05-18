## Teoría de Conjuntos en SQL

Los operadores de conjuntos combinan los resultados de dos o más consultas (`SELECT`) en un único listado.

### UNION
- **¿Qué es?**: Combina los resultados de dos consultas y **elimina los registros duplicados**.
- 📌 **Ejemplo:** Tienes una lista de "Clientes Nacionales" y otra de "Clientes Internacionales". `UNION` te devuelve una lista única de todos los clientes, sin repetir a nadie.

### UNION ALL
- **¿Qué es?**: Combina los resultados, pero **mantiene los duplicados**. Es más rápido que `UNION` porque no gasta tiempo buscando repeticiones.
- 📌 **Ejemplo:** Al juntar el historial de compras de enero y febrero. Si un cliente hizo exactamente la misma compra en ambos meses, aparecerá dos veces.

### EXCEPT (o MINUS)
- **¿Qué es?**: Resta conjuntos. Devuelve los registros de la primera consulta que **no existen** en la segunda.
- 📌 **Ejemplo:** Tienes una lista de "Todos los Empleados" y otra de "Empleados de Vacaciones". `EXCEPT` te devuelve la lista de los que están trabajando hoy.

### EXCEPT ALL
- **¿Qué es?**: Igual a EXCEPT, pero considera la cantidad de repeticiones. Si un dato está 3 veces arriba y 1 vez abajo, el resultado lo mostrará 2 veces.
- 📌 **Ejemplo:** Tienes 5 facturas pendientes de $100 y el cliente te paga 2 de ellas. `EXCEPT ALL` te devolverá las 3 facturas de $100 que aún quedan sin pagar.

### INTERSECT
- **¿Qué es?**: Encuentra las coincidencias. Devuelve únicamente los registros que están presentes **en ambas** consultas (sin duplicados).
- 📌 **Ejemplo:** Tienes una lista de "Usuarios de Android" y otra de "Usuarios de Tablet". `INTERSECT` te mostrará solo a los usuarios que usan una Tablet con Android.

### INTERSECT ALL
- **¿Qué es?**: Devuelve las coincidencias, pero mantiene duplicados según el menor número de veces que aparezcan en ambas listas.
- 📌 **Ejemplo:** Si un usuario aparece 3 veces en la lista de morosos de enero y 2 veces en la de febrero, `INTERSECT ALL` lo devolverá 2 veces (el mínimo común).