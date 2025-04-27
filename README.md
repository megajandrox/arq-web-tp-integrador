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
2. Instala las dependencias de Bash:
```bash
cd api
pip install -r requirements.txt
```

3. Inicializar la base de datos
Crea las tablas necesarias en la base de datos ejecutando el script create_db.py:
```bash
python scripts/create_db.py
```
4. Verifica que se haya creado el archivo user_manager.db en el directorio raíz del proyecto.

## Ejecución de la aplicación
* *Opción 1*: Usando Docker Construye y levanta los servicios con Docker Compose:
```bash
docker-compose up --build
```
* La API estará disponible en http://localhost:8000.

* *Opción 2*: Ejecutar localmente
* Asegúrate de que las variables de entorno estén configuradas en el archivo api/.env.
* Ejecuta la aplicación FastAPI:
```bash
python api/main.py
```
* La API estará disponible en http://localhost:5000.

## Endpoints disponibles
Puedes explorar los endpoints disponibles utilizando la documentación interactiva de Swagger en:

* http://localhost:5000/docs (si ejecutas localmente)
* http://localhost:8000/docs (si usas Docker)
### Notas adicionales
Asegúrate de que el archivo .env contenga las configuraciones correctas para la base de datos y otros parámetros.
Si necesitas realizar cambios en los modelos de la base de datos, recuerda ejecutar nuevamente el script create_db.py para aplicar los cambios.