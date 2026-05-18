## Arquitectura de Base de Datos: Teoría y modelado estructural de base de datos relacionales

### Base de datos
- **¿Para qué sirve?**: Para centralizar, proteger y administrar grandes volúmenes de información de manera persistente.
- **¿Qué permite hacer?**: Permite almacenar, buscar, actualizar y relacionar datos de manera rápida y estructurada.
- **¿Qué es?**: Un sistema informático organizado que recopila y guarda datos estructurados de forma electrónica.

### Esquema
- **¿Para qué sirve?**: Sirve como el plano o esqueleto que dicta las reglas de organización de la información.
- **¿Qué permite hacer?**: Permite estructurar tablas, definir tipos de datos, imponer restricciones y establecer relaciones seguras entre entidades.
- **¿Qué es?**: Es el diseño arquitectónico y lógico que define cómo se construye y organiza toda la base de datos.
- **Sirven para separar por tematica**: Por ejemplo, una base de datos de una tienda puede tener un esquema para clientes, otro para productos y otro para ventas.

### Tabla
- **¿Para qué sirve?**: Para agrupar, clasificar y almacenar información detallada sobre un concepto o entidad específica.
- **¿Qué permite hacer?**: Permite estructurar los datos de manera que sean fácilmente legibles, accesibles y vinculables con otras tablas.
- **¿Qué es?**: Es la estructura fundamental de almacenamiento, compuesta por una cuadrícula de columnas (atributos) y filas (registros).

### ¿SQL o NoSQL? Cómo elegir según tu proyecto

**Elige SQL (Relacional) cuando:**
- **La estructura es predecible:** Tienes datos fijos y estructurados.
- **La integridad es crítica:** Necesitas transacciones seguras que no pueden fallar.
- **Hay relaciones complejas:** Necesitas vincular información de múltiples lugares constantemente.
- 📌 **Ejemplo práctico:** La app de un **Banco**. Las transferencias de dinero deben ser exactas (si alguien envía dinero, al otro le tiene que llegar sí o sí en el mismo instante), y todos los clientes tienen exactamente los mismos datos obligatorios (nombre, cuenta, saldo).

**Elige NoSQL (No Relacional) cuando:**
- **La estructura es dinámica:** Manejas datos variables o sin un formato fijo.
- **Escalabilidad masiva:** Necesitas manejar enormes cantidades de información.
- **Velocidad extrema:** Tienes aplicaciones en tiempo real donde el rendimiento manda.
- 📌 **Ejemplo práctico:** El catálogo de **Netflix** o una **Red Social**. Una película tiene actores y directores, pero una serie tiene temporadas y episodios. Cada elemento tiene información distinta y necesitas que cargue rapidísimo para millones de usuarios al mismo tiempo, sin importar que la estructura varíe.


## La anatomía del dato: micro-estructuras

### Registro (Fila)
Es una instancia individual de datos dentro de una tabla. Representa una entidad específica y única en un momento dado.
- 📌 **Ejemplo:** En una tabla de "Usuarios", un registro sería la fila completa con los datos de "Juan Pérez" (su ID, correo y fecha de registro).

### Clave (Key)
Es un atributo (o conjunto de columnas) que identifica de forma única un registro, o que se utiliza para establecer conexiones y relaciones entre diferentes tablas.
- 📌 **Ejemplo:** El número de DNI, RUT o Pasaporte. Dos personas pueden llamarse igual, pero su clave es única e irrepetible en todo el sistema.

### Índice (Index)
Es una estructura auxiliar técnica que permite acelerar masivamente la velocidad de búsqueda de registros dentro de una tabla.
- 📌 **Ejemplo:** Funciona igual que el índice alfabético de un libro: en lugar de leer cada página para encontrar un tema, miras el índice y vas directo a la página exacta.