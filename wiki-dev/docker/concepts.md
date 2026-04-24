# Maestría en Docker: de la Consola a la Orquestación

Docker es una plataforma que permite crear, ejecutar y administrar contenedores. Consiste en entornos ligeros y portables que incluyen todo lo necesario para ejecutar una aplicación.

## Beneficios

- **Aislamiento:** Cada aplicación corre en su propio entorno.
- **Portabilidad:** Se puede ejecutar en cualquier entorno.
- **Ligereza:** Consume menos recursos que una máquina virtual.
- **Velocidad:** Se inicia en segundos.
- **Escalabilidad:** Se puede escalar horizontalmente.

## Conceptos Clave

### 1. ¿Qué es un contenedor?
Un contenedor es una unidad de software que empaqueta el código de una aplicación y todas sus dependencias, de modo que pueda ejecutarse de forma rápida y fiable en cualquier entorno informático.

### 2. ¿Qué es una imagen?
Una imagen es una plantilla inmutable que contiene el código de una aplicación y todas sus dependencias, de modo que pueda ejecutarse de forma rápida y fiable en cualquier entorno informático.

### 3. ¿Qué es un registro?
Un registro es un repositorio de imágenes de contenedores.

### 4. ¿Qué es un orquestador?
Un orquestador es una herramienta que permite automatizar la gestión de contenedores.


## El Ecosistema de Docker

- **Dockerfile:** Es una receta o conjunto de instrucciones paso a paso utilizadas para construir una imagen de Docker.
- **Docker Image (Imagen):** Es una plantilla inmutable preconfigurada que empaqueta el código de la aplicación y todas sus dependencias. Garantiza una ejecución rápida y uniforme en cualquier sistema.
- **Docker Container (Contenedor):** Es una instancia viva y en ejecución de una imagen de Docker.
- **Volumes (Volúmenes):** Mecanismo principal para la persistencia de datos. Permiten que la información sobreviva más allá del ciclo de vida efímero de un contenedor.
- **Network (Red):** Infraestructura que facilita la comunicación. Permite que los contenedores se conecten y se comuniquen entre sí, así como con el mundo exterior o la máquina anfitriona.

## El motor bajo el capó: ¿Por qué hablamos de Linux?

Los contenedores no son magia, son en esencia son procesos nativos de linux
ejecuandose en forma aislada.

## El poder de la terminal, comandos basicos

- **`pwd`**: Muestra la ruta completa de la carpeta donde te encuentras actualmente (Print Working Directory).
- **`ls -la`**: Lista todos los archivos y carpetas (incluyendo los ocultos) con información detallada.
- **`cd /`**: Navega a la raíz del sistema de archivos.
- **`cd ~`** *(o simplemente `cd`)*: Vuelve a tu directorio personal ("home").
- **`mkdir test`**: Crea una nueva carpeta llamada "test".
- **`cp origen destino`**: Copia un archivo o carpeta de un lugar a otro.
- **`mv origen destino`**: Mueve un archivo de lugar o sirve para cambiarle el nombre.
- **`rm archivo.txt`**: Elimina el archivo de forma permanente.
- **`cat archivo.txt`**: Muestra todo el contenido de un archivo directamente en la terminal.
- **`less archivo.txt`**: Abre el archivo de forma interactiva, permitiendo desplazarse por el contenido (útil para archivos grandes).
- **`tail -f log.txt`**: Muestra las últimas líneas de un archivo y se actualiza en tiempo real (ideal para monitorear logs).

*Pro tip: Dominar cat y tail te ahorrará horas de tu vida, te permitirá leer los logs de tus
contenedores*

### Edición en consola

- **`nano archivo.txt`**: Abre un editor de texto integrado en la terminal. Muy sencillo y fácil de usar.

### Anatomia de permisos
-rwx Usuario/propietario Puede leer, escribir y ejecutar
r-x Grupo Puede leer y ejecutar
r-- Otros Puede leer


### Primeros Pasos: El ciclo de vida básico en Docker

Para entender cómo funcionan los contenedores y practicar los comandos de terminal que acabamos de revisar, descargaremos un entorno Linux limpio de Ubuntu y realizaremos un ejercicio práctico.

**Paso 1: Explorar Docker Hub**
Docker Hub es el repositorio oficial en la nube donde se almacenan las imágenes públicas. Puedes imaginarlo como el "App Store" de Docker. 

**Paso 2: La descarga (Pull)**
El objetivo aquí es descargar una imagen base inmutable de Ubuntu directamente a tu máquina.
```bash
docker pull ubuntu
```

**Paso 3: Ejecutar el contenedor (Run)**
Ahora vamos a crear un contenedor y entrar a su consola de forma interactiva.
```bash
docker run -it ubuntu bash
```
*(Los parámetros `-it` le indican a Docker que queremos un modo interactivo y una terminal conectada al contenedor. `bash` es el programa de terminal que queremos ejecutar).*

**Paso 4: El Tutorial Práctico - Crear, visualizar y destruir archivos**

Una vez que presiones Enter, verás que tu consola cambió. ¡Felicidades, estás dentro de una máquina virtual ligera usando Ubuntu! Ahora sigue estos pasos:

1. **Asegura tu ubicación base:** Ve directamente a la raíz del usuario y rectifica en dónde te encuentras:
   ```bash
   cd ~
   pwd
   ```

2. **Crea el área de trabajo:** Fabrica un nuevo fólder y entra a él:
   ```bash
   mkdir tutorial_basico
   cd tutorial_basico
   ```

3. **Crea tu archivo:** Vamos a crear un archivo escribiendo directamente sobre él mediante un comando (ya que Ubuntu a nivel Docker no trae editores visuales instalados por defecto).
   ```bash
   echo "Hola Docker! Este es mi primer archivo" > archivo.txt
   ```

4. **Verifica tus resultados:**
   ```bash
   ls -la
   cat archivo.txt
   ```

5. **Prueba borrar el archivo "para siempre":**
   ```bash
   rm archivo.txt
   ls -la
   ```
   *(Verás que el archivo ha desaparecido por completo).*

**Paso 5: Salir del sistema**
Para abandonar tu contenedor, simplemente escribe:
```bash
exit
```
Al escribir `exit`, tu contenedor se detendrá. Como no configuraste un Volumen de persistencia para guardar esa carpeta `tutorial_basico`, toda esa información se perdió. Esta es la regla de oro: **Lo que pasa en el contenedor, se destruye con el contenedor.**

## Docker run vs docker pull

- **`docker pull`**: Descarga una imagen desde un registro (como Docker Hub) a tu entorno local. **No ejecuta ningún contenedor**.
- **`docker run`**: Crea un contenedor nuevo a partir de una imagen y **lo ejecuta**. Si la imagen no se encuentra en tu entorno local, `docker run` realiza automáticamente un `docker pull` para descargarla antes de iniciar el contenedor.

En resumen: `pull` solo descarga la plantilla, mientras que `run` descarga (si es necesario), crea la instancia y la pone en marcha.
