# Variables
PYTHON = python
DOCKER_COMPOSE = docker compose
APP_DIR = api
SCRIPTS_DIR = scripts
DB_FILE = user_manager.db 

init-db:
	@echo "Inicializando la base de datos..."
	PYTHONPATH=$(shell pwd) $(PYTHON) $(SCRIPTS_DIR)/create_db.py
	@echo "Base de datos inicializada."

populate-db:
	@echo "Populando datos en la base de datos..."
	@sleep 10 
	PYTHONPATH=$(shell pwd) $(PYTHON) $(SCRIPTS_DIR)/populate_data.py
	@echo "Datos populados correctamente."

run-local-bg:
	@echo "Ejecutando la aplicación localmente en segundo plano..."
	PYTHONPATH=$(shell pwd) $(PYTHON) $(APP_DIR)/main.py & echo $$! > server.pid

stop-local:
	@echo "Deteniendo la aplicación local en segundo plano..."
	@if [ -f server.pid ]; then \
	    kill $$(cat server.pid); \
	    rm server.pid; \
	    echo "Servidor detenido."; \
	else \
	    echo "No se encontró el servidor en ejecución."; \
	fi

clean-db:
	@echo "Eliminando la base de datos..."
	@if [ -f $(DB_FILE) ]; then \
	    rm $(DB_FILE); \
	    echo "Base de datos eliminada."; \
	else \
	    echo "No se encontró la base de datos para eliminar."; \
	fi

init-all: clean-db init-db run-local-bg populate-db
	@echo "Proyecto inicializado y aplicación levantada con Docker."

help:
	@echo "Comandos disponibles:"
	@echo "  make init-db       - Inicializar la base de datos."
	@echo "  make populate-db   - Popular datos en la base de datos."
	@echo "  make docker-up     - Levantar la aplicación con Docker."
	@echo "  make docker-down   - Detener la aplicación con Docker."
	@echo "  make run-local     - Ejecutar la aplicación localmente."
	@echo "  make init-all      - Inicializar todo y levantar la app con Docker."
	@echo "  make help          - Mostrar esta ayuda."