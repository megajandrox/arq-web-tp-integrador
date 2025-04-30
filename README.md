# Arquitectura Web TP Integrador

Este proyecto es una aplicación web basada en FastAPI para la gestión de usuarios.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

- [Python 3.9+](https://www.python.org/downloads/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd arq-web-tp-integrador
   ```

2. (Opcional) Si deseas ejecutar la aplicación localmente sin Docker, instala las dependencias de Python:

   ```bash
   pip install -r requirements.txt
   ```

## Inicializar la base de datos

1. Crea las tablas necesarias en la base de datos ejecutando el script `create_db.py`:

   ```bash
   PYTHONPATH=. python scripts/create_db.py
   ```

2. Verifica que se haya creado el archivo `user_manager.db` en el directorio raíz del proyecto.

## Ejecución de la aplicación

### Opción 1: Usando Docker

1. Construye y levanta los servicios con Docker Compose:

   ```bash
   docker compose up --build
   ```

2. La API estará disponible en [http://localhost:9000](http://localhost:9000).

### Opción 2: Ejecutar localmente

1. Asegúrate de que las variables de entorno estén configuradas en el archivo `api/.env`.

2. Ejecuta la aplicación FastAPI:

   ```bash
   PYTHONPATH=. python api/main.py
   ```

3. La API estará disponible en [http://localhost:5000](http://localhost:5000).

## Popular datos en la base de datos

1. Instala `jq`, una herramienta necesaria para procesar las respuestas JSON del script:

   - **Debian/Ubuntu**:
     ```bash
     sudo apt-get install jq
     ```

2. Una vez que la aplicación esté en ejecución (ya sea localmente o con Docker), ejecuta el script `populate_data.py` para popular datos en las entidades `users`, `roles` y `user_roles`:

   ```bash
   PYTHONPATH=. python scripts/populate_data.py
   ```

3. El script creará automáticamente:
   - Roles (`Admin`, `User`).
   - Usuarios (`pepe`, `cacho`).
   - Asignará roles a los usuarios.

4. Verifica los datos creados accediendo a los endpoints correspondientes o revisando la salida del script.

## Endpoints disponibles

Puedes explorar los endpoints disponibles utilizando la documentación interactiva de Swagger en:

- [http://localhost:5000/docs](http://localhost:5000/docs) (si ejecutas localmente)
- [http://localhost:9000/docs](http://localhost:9000/docs) (si usas Docker)

## Notas adicionales

- Verificar de que el archivo `.env` contenga las configuraciones correctas para la base de datos y otros parámetros.
- Para realizar cambios en los modelos de la base de datos, se debe ejecutar nuevamente el script `create_db.py` para aplicar los cambios.
- Para popular la base de datos con valores dummy utilizar `populate_data.py`.

**Documentación adicional** con enlaces a:
   - [patterns.md](http://_vscodecontentref_/1): Documentación sobre los patrones de diseño aplicados.
   - [estructura.md](http://_vscodecontentref_/2): Descripción de la estructura del proyecto.
