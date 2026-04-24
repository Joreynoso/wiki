# Maestría en Docker: Construcción de imagenes y persistencia de datos. 

## ¿Cómo construir imágenes personalizadas?

Aunque Docker Hub ofrece miles de imágenes base listas para usar (como Ubuntu, Node.js o Nginx), en la vida real rara vez una aplicación funciona solo con la base. Necesitamos crear imágenes personalizadas para:

- **Empaquetar nuestro propio código fuente.**
- **Instalar librerías y dependencias específicas** que requiera nuestro proyecto.
- **Definir configuraciones propias** (variables de entorno, puertos expuestos, rutas de trabajo).

Al empaquetar todo esto en una imagen personalizada, garantizamos la **portabilidad absoluta**: la aplicación se ejecutará exactamente de la misma manera en la computadora de otro desarrollador, en un servidor de pruebas o en producción. De esta forma, eliminamos para siempre el clásico problema de *"en mi máquina sí funciona"*.

Para lograr esto, Docker utiliza un archivo especial de texto plano llamado **`Dockerfile`**. Este archivo actúa como una "receta de cocina" que contiene instrucciones paso a paso para que Docker ensamble la imagen final capa por capa.


## Dockerfile como receta

Aunque a simple vista un Dockerfile pueda parecer intimidante, en realidad funciona con una lógica muy sencilla. Es una secuencia de comandos, ordenados de arriba hacia abajo, donde cada línea ejecuta una acción específica para construir progresivamente la imagen final. Es como seguir una receta de cocina: empiezas con ingredientes base, añades especias, luego los componentes principales y finalmente el toque final.

**Características principales:**
- **Define** el entorno de ejecución exacto.
- **Garantiza** automatización y portabilidad.
- **Se ejecuta** mediante el comando `docker build`.

### Ejemplos de archivos Dockerfile

**Ejemplo 1: Aplicación Node.js**
```dockerfile
# (base) definimos la imagen base
FROM node:18-alpine

# (directorio) definimos el directorio de trabajo
WORKDIR /app

# (transferencia) copiamos los archivos de dependencias
COPY package*.json .

# (ejecución) instalamos las dependencias
RUN npm install

# (transferencia) copiamos el resto de archivos
COPY . .

# (puerto) exponemos el puerto
EXPOSE 3000

# (arranque) definimos el comando de inicio
CMD ["npm", "start"]
```

**Ejemplo 2: Script en Python**
```dockerfile
# (base) Imagen base
FROM ubuntu:22.04.1

# (ejecución) Actualizamos el sistema e instalamos python
RUN apt-get update && apt-get install -y python3

# (directorio) Definimos el directorio de trabajo
WORKDIR /app

# (transferencia) Copiamos el archivo hola.py al directorio de trabajo
COPY hola.py .

# (arranque) Definimos el comando de inicio
CMD ["python3", "hola.py"]
```

## Manos a la obra: nuestro primer Dockerfile

**1. Crea el entorno de trabajo:**
```bash
mkdir my-first-app && cd my-first-app
```

**2. Crea el archivo de la aplicación (`hola.py`):**
```bash
nano hola.py
```
*Contenido del archivo:*
```python
print("Hola desde mi primera imagen personalizada")
```

**3. Crea el `Dockerfile`:**
```bash
nano Dockerfile
```
*Contenido del archivo:*
```dockerfile
FROM ubuntu:22.04.1
RUN apt-get update && apt-get install -y python3
WORKDIR /app
COPY hola.py .
CMD ["python3", "hola.py"]
```

## De los planos a la realidad

Utilizamos el `.` (punto) al final del comando para indicarle a Docker que el *contexto de construcción* (los archivos a usar) es nuestro directorio actual.

```bash
# Construir la imagen a partir del Dockerfile
docker build -t mi-primer-app .

# Ejecutar un contenedor basado en nuestra nueva imagen
docker run -it mi-primer-app
```

## Cómo persistimos nuestros contenedores

Los **volúmenes** actúan como "discos duros externos" o carpetas compartidas. Cuando el contenedor se detiene o se destruye, los datos almacenados en un volumen se conservan de forma segura en la máquina host.

### Matriz de diagnóstico de almacenamiento

- 📦 **Volúmenes gestionados (Volumes):** Almacenamiento propio gestionado por Docker (usualmente en `/var/lib/docker/volumes/`). 
  - *Uso ideal:* Entornos de producción y almacenamiento de datos persistentes opacos (como bases de datos).
- 🔗 **Bind mounts:** Vincula una ruta específica de tu máquina host (ej. `/ruta/en/tu/pc`) a una ruta en el contenedor.
  - *Uso ideal:* Entornos de desarrollo, donde necesitas acceso directo y en tiempo real a código, logs o archivos.
- ⚡ **Tmpfs mounts:** Almacenamiento volátil directamente en la memoria RAM del host.
  - *Uso ideal:* Datos temporales o sensibles que por seguridad o rendimiento no deben escribirse en el disco físico.

### Implementando un Bind Mount

Vamos a montar la carpeta actual de nuestra máquina host en el directorio `/mnt` del contenedor:

```bash
docker run -it -v $(pwd)/datos:/mnt ubuntu bash
```

Una vez dentro del contenedor, creamos un archivo en esa ruta compartida:
```bash
echo "Hola Mundo" > /mnt/info.txt
```

> [!IMPORTANT]
> **Prueba de fuego:** Al escribir `exit` y destruir el contenedor, si revisas la carpeta `datos` en tu máquina host, verás que **el archivo `info.txt` seguirá existiendo intacto**.

## Tablero de mantenimiento

- **Ver contenedores (activos/inactivos):** `docker ps -a`
- **Ver imágenes:** `docker images`
- **Ver volúmenes:** `docker volume ls`
- **Eliminar contenedor:** `docker rm <id>`
- **Eliminar imagen:** `docker rmi <id>`
- **Eliminar volumen:** `docker volume rm <nombre>`

## Ejercicio Integrador: Servidor Web en Python

```bash
docker run -d -p 8080:80 --name web -v ./app:/app python:3.10-slim python -m http.server 80
```
- `-d`: Ejecuta en segundo plano (detached).
- `-p 8080:80`: Mapea el puerto 8080 de tu PC al 80 del contenedor.
- `--name web`: Asigna un nombre fácil de recordar.
- `-v ./app:/app`: Monta el directorio local al contenedor.