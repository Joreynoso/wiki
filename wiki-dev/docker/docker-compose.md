
## Docker Hub
Es el github para imagenes de Docker, es la plataforma de docker oficial para 
publicar y compartir imagenes. Por defecto los contenedores no persisten datos, 
cuando se elimina un contenedor se elimina todo su contenido. Para 
persistir datos se utilizan volúmenes.
Flujo: `Developer laptop` -> `Production servers` -> `CI/CD`

## Docker Hub: Flujo de publicación en 3 pasos

1. Tag (Etiquetar) --> asignar un nombre y etiqueta a la imagen vinculada al usuario
2. Login (Autenticarse) --> conectar tu consola local en cuenta de docker hub en la nube
3. Push (Empujar) --> enviar la imagen a docker hub al repositorio global

## Docker Hub: Comandos clave para la distribución

1. docker tag mi_app_js [tu_usuario]/mi_app_js:v1.0
2. docker login
3. docker push [tu_usuario]/mi_app_js:v1.0

## El problema de orquestar manualmente

Ejecutar una aplicación completa con frontend, backend, base de datos y Redis puede ser tedioso.

Se deben ejecutar los siguientes comandos:
1. docker build -t frontend .
2. docker build -t backend .
3. docker build -t base_de_datos .
4. docker build -t redis .
5. docker run -d --name frontend frontend
6. docker run -d --name backend backend
7. docker run -d --name base_de_datos base_de_datos
8. docker run -d --name redis redis

Lo que lo vuelve tedioso y propenso a errores.
También se deben recordar el orden exacto de los pasos.

## Docker Compose: La orquestación declarativa

Docker compose es una herramienta que permite orquestar contenedores. 
Se ejecuta localmente para levantar el ambiente de desarrollo en la maquina local.
Se define en un archivo yaml: `docker-compose.yml`. 
En ese archivo se especifica la cantidad de contenedores, volúmenes, redes, 
puertos y variables de entorno. 

Beneficios clave:

1. Incia varios servicios con un solo comando
2. Facilita la configuración y despliegue de aplicaciones con múltiples servicios
3. Estandariza el ambiente de desarrollo
4. Reutilizable en cualquier entorno con Docker

## Cambio de paradigma, CLI VS COMPOSE

| Caracteristica | Docker CLI | Compose |
| :--- | :--- | :--- |
| **Enfoque** | Imperativo (paso a paso) | Declarativo (estado deseado) |
| **Ejecución** | Múltiples comandos largos | Un solo comando |
| **Reproducibilidad** | Baja (depende del historial) | Alta (archivo YAML) |
| **Escenario ideal** | Pruebas rápidas (1 servicio) | Entornos completos (app + base de datos) |




