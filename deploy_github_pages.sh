#!/bin/bash

# Configuración
DIST_DIR="webapp/dist"  # Carpeta con los archivos generados por npm run build
BRANCH="gh-pages"       # Branch donde se publicará la GitHub Page
REPO_URL=$(git config --get remote.origin.url)  # URL del repositorio remoto

# Verificar si la carpeta dist existe
if [ ! -d "$DIST_DIR" ]; then
  echo "Error: La carpeta $DIST_DIR no existe. Asegúrate de ejecutar 'npm run build' antes de desplegar."
  exit 1
fi

# Crear un directorio temporal para el despliegue
TEMP_DIR=$(mktemp -d)
echo "Creando un directorio temporal en $TEMP_DIR"

# Copiar los archivos de dist al directorio temporal
cp -r $DIST_DIR/* $TEMP_DIR

# Cambiar al branch gh-pages
echo "Cambiando al branch $BRANCH"
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH

# Limpiar el contenido actual del branch
echo "Limpiando el contenido actual del branch $BRANCH"
git rm -rf . > /dev/null 2>&1

# Copiar los archivos del directorio temporal al branch
echo "Copiando los archivos de $TEMP_DIR al branch $BRANCH"
cp -r $TEMP_DIR/* .

# Agregar y hacer commit de los cambios
echo "Agregando y haciendo commit de los cambios"
git add .
git commit -m "Desplegando la aplicación en GitHub Pages"

# Empujar los cambios al repositorio remoto
echo "Empujando los cambios al branch $BRANCH"
git push -u origin $BRANCH

# Volver al branch original
echo "Volviendo al branch original"
git checkout -

# Eliminar el directorio temporal
echo "Eliminando el directorio temporal"
rm -rf $TEMP_DIR

echo "Despliegue completado. La aplicación está disponible en GitHub Pages."