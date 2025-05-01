# Estructura del Proyecto

## user-manager/
Nombre del proyecto.

### api/
**FastAPI (Python)**  
Contiene la lógica del backend.

- **core/**  
  Lógica principal del backend.
  - `models.py`: Modelos de usuarios, roles y relaciones (SQLAlchemy/Pydantic).
  - `schemas.py`: Esquemas de validación y serialización.
  - `database.py`: Configuración de la base de datos.
  - `repository.py`: Lógica de acceso a datos.
- **endpoints/**  
  Rutas de la API.
  - `users.py`: CRUD de usuarios.
  - `roles.py`: CRUD de roles.
  - `user_roles.py`: Asignación y eliminación de roles a usuarios.
- **services/**  
  Lógica de negocio.
  - `user_service.py`: Lógica relacionada con usuarios.
  - `role_service.py`: Lógica relacionada con roles.
  - `user_role_service.py`: Lógica para asignación de roles.
- `main.py`: Punto de entrada de la aplicación FastAPI.
- `requirements.txt`: Dependencias del proyecto.

---

### webapp/
**React.js**  
Contiene la lógica del frontend.

- **public/**  
  Assets estáticos.
- **src/**  
  Código fuente del frontend.
  - **features/**  
    Lógica por funcionalidad.
    - `auth/`: Login/registro.
    - `users/`: Lista/edición de usuarios.
    - `roles/`: Gestión de roles.
  - **lib/**  
    Utilidades (axios, hooks).
  - `App.tsx`: Componente raíz.
- `package.json`: Dependencias del proyecto.
- `vite.config.ts`: Configuración de Vite (recomendado).

---

### scripts/
Scripts de despliegue y migración.

- `create_db.py`: Script para inicializar la base de datos.
- `populate_data.py`: Script para popular la base de datos con datos de ejemplo.

---

### Archivos Raíz
- `.env`: Variables de entorno (compartidas).
- `docker-compose.yml`: Orquestación de servicios.
- `Makefile`: Comandos para simplificar tareas comunes.
- `README.md`: Instrucciones del proyecto.