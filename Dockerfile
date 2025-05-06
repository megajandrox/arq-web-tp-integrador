FROM python:3.13-slim

# Instalar make y otras dependencias necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    make \
    gcc \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar dependencias y scripts al contenedor
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./api /app/api
COPY ./scripts /app/scripts
COPY ./Makefile /app/Makefile

ENV PYTHONPATH=/app

# Ejecutar make init-all y luego iniciar el servidor
CMD make init-all && uvicorn api.main:app --host 0.0.0.0 --port 8000

EXPOSE 8000