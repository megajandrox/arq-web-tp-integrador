#!/bin/bash

# Base URL de la API
BASE_URL="http://localhost:5000"

# Crear roles
echo "Creando roles..."
ROLE_ADMIN=$(curl -s -X POST "$BASE_URL/roles/" -H "Content-Type: application/json" -d '{"name": "Admin", "description": "Administrator role"}')
ROLE_USER=$(curl -s -X POST "$BASE_URL/roles/" -H "Content-Type: application/json" -d '{"name": "User", "description": "Regular user role"}')
echo $ROLE_ADMIN
ROLE_ADMIN_ID=$(echo $ROLE_ADMIN | jq -r '.id')
ROLE_USER_ID=$(echo $ROLE_USER | jq -r '.id')

if [[ -z "$ROLE_ADMIN_ID" || -z "$ROLE_USER_ID" ]]; then
  echo "Error al crear roles. Verifica el endpoint /roles/."
  exit 1
fi

echo "Roles creados: Admin ID=$ROLE_ADMIN_ID, User ID=$ROLE_USER_ID"

# Crear usuarios
echo "Creando usuarios..."
USER_PEPE=$(curl -s -X POST "$BASE_URL/users/" -H "Content-Type: application/json" -d '{"username": "pepe", "email": "pepe@example.com", "password_hash": "hashedpassword1"}')
USER_CACHO=$(curl -s -X POST "$BASE_URL/users/" -H "Content-Type: application/json" -d '{"username": "cacho", "email": "cacho@example.com", "password_hash": "hashedpassword2"}')

USER_PEPE_ID=$(echo $USER_PEPE | jq -r '.id')
USER_CACHO_ID=$(echo $USER_CACHO | jq -r '.id')

if [[ -z "$USER_PEPE_ID" || -z "$USER_CACHO_ID" ]]; then
  echo "Error al crear usuarios. Verifica el endpoint /users/."
  exit 1
fi

echo "Usuarios creados: Pepe ID=$USER_PEPE_ID, Cacho ID=$USER_CACHO_ID"

# Asignar roles a usuarios
echo "Asignando roles a usuarios..."
ASSIGN_PEPE=$(curl -s -X POST "$BASE_URL/user-roles/" -H "Content-Type: application/json" -d "{\"user_id\": $USER_PEPE_ID, \"role_id\": $ROLE_ADMIN_ID}")
ASSIGN_CACHO=$(curl -s -X POST "$BASE_URL/user-roles/" -H "Content-Type: application/json" -d "{\"user_id\": $USER_CACHO_ID, \"role_id\": $ROLE_USER_ID}")

if [[ $(echo $ASSIGN_PEPE | jq -r '.detail') || $(echo $ASSIGN_CACHO | jq -r '.detail') ]]; then
  echo "Error al asignar roles. Verifica el endpoint /user-roles/."
  exit 1
fi

echo "Roles asignados a usuarios."

# Verificar datos
echo "Verificando datos creados..."
echo "Usuarios con roles:"
curl -s "$BASE_URL/user-roles/roles/$USER_PEPE_ID" | jq
curl -s "$BASE_URL/user-roles/roles/$USER_CACHO_ID" | jq

echo "Roles con usuarios:"
curl -s "$BASE_URL/user-roles/users/$ROLE_ADMIN_ID" | jq
curl -s "$BASE_URL/user-roles/users/$ROLE_USER_ID" | jq

echo "Datos poblados exitosamente."