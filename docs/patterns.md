# Patrones de Diseño Aplicados

## 1. Patrón Repository
- **Descripción**: Abstrae el acceso a la base de datos, proporcionando una capa intermedia entre la lógica de negocio y la persistencia.
- **Dónde se aplica**:
  - Clases como `UserRepository`, `RoleRepository`, y `UserRoleRepository` encapsulan las operaciones CRUD sobre los modelos.
- **Ventajas**:
  - Desacopla la lógica de negocio de los detalles de la base de datos.
  - Facilita el cambio de la tecnología de persistencia en el futuro.

---

## 2. Patrón Service
- **Descripción**: Organiza la lógica de negocio en clases dedicadas, separándola de los controladores y repositorios.
- **Dónde se aplica**:
  - Clases como `UserService`, `RoleService`, `PermissionService`, y `UserRoleService` encapsulan la lógica de negocio relacionada con usuarios, roles, permisos y relaciones entre ellos.
- **Ventajas**:
  - Centraliza la lógica de negocio.
  - Facilita la reutilización y el mantenimiento del código.

---

## 3. Patrón Dependency Injection
- **Descripción**: Las dependencias (como repositorios y servicios) se inyectan en los controladores y servicios en lugar de ser instanciadas directamente.
- **Dónde se aplica**:
  - Los servicios (`UserService`, `RoleService`, etc.) reciben los repositorios como dependencias en sus constructores.
  - Esto se observa en las inicializaciones como `super().__init__(repository)` en las clases de servicio.
- **Ventajas**:
  - Facilita la prueba unitaria al permitir el uso de dependencias simuladas (mocks).
  - Mejora la modularidad y el desacoplamiento.

---

## 4. Patrón Factory (implícito en Pydantic)
- **Descripción**: Pydantic actúa como una fábrica para crear objetos validados a partir de datos de entrada.
- **Dónde se aplica**:
  - Los modelos Pydantic como `UserResponse`, `RoleResponse`, y `PermissionResponse` validan y transforman los datos antes de enviarlos al cliente.
  - Métodos como `UserResponse.model_validate(user)` convierten los datos del modelo SQLAlchemy en objetos Pydantic.
- **Ventajas**:
  - Garantiza que los datos enviados al cliente cumplan con un esquema definido.
  - Simplifica la validación y serialización de datos.

---

## 5. Patrón Template Method
- **Descripción**: Define el esqueleto de un algoritmo en una clase base y permite que las subclases redefinan ciertos pasos del algoritmo sin cambiar su estructura general.
- **Dónde se aplica**:
  - La clase `BaseService` define métodos genéricos como `get_all`, `get_by_id`, `create`, `update`, y `delete`, que son reutilizados y extendidos por las subclases (`UserService`, `RoleService`, etc.).
- **Ventajas**:
  - Reduce la duplicación de código al centralizar la lógica común.
  - Facilita la extensión de funcionalidades específicas en las subclases.

---
