# Estructura del Proyecto

## user-manager/
Nombre del proyecto.

### api/
**FastAPI (Python)**  
Contiene la lógica del backend.

- **core/**  
  Lógica principal del backend.
  - `models.py`: Modelos de usuarios (SQLAlchemy/Pydantic).
  - `schemas.py`: Esquemas de validación.
  - `auth.py`: Autenticación (JWT/OAuth2).
- **endpoints/**  
  Rutas de la API.
  - `users.py`: CRUD de usuarios.
  - `auth.py`: Login/registro.
- `main.py`: App FastAPI.
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
  - **lib/**  
    Utilidades (axios, hooks).
  - `App.tsx`: Componente raíz.
- `package.json`: Dependencias del proyecto.
- `vite.config.ts`: Configuración de Vite (recomendado).

---

### scripts/
Scripts de despliegue y migración.

---

### Archivos Raíz
- `.env`: Variables de entorno (compartidas).
- `docker-compose.yml`: Orquestación de servicios.
- `README.md`: Instrucciones del proyecto.