# API Documentation

## Overview
This is the documentation for the FastAPI application version `0.1.0`. The API provides endpoints for managing users, roles, permissions, and reports.

---

## Endpoints

### Users (`/api/users/`)

#### **Get All Users**
- **Method**: `GET`
- **Summary**: Retrieve all users.
- **Responses**:
  - **200**: Returns a list of users.

#### **Create User**
- **Method**: `POST`
- **Summary**: Create a new user.
- **Request Body**:
  - **Schema**: `UserCreate`
- **Responses**:
  - **201**: User created successfully.
  - **422**: Validation error.

#### **Get User**
- **Method**: `GET /api/users/{user_id}`
- **Summary**: Retrieve a user by ID.
- **Path Parameters**:
  - `user_id` (integer): ID of the user.
- **Responses**:
  - **200**: Returns the requested user.
  - **422**: Validation error.

#### **Update User**
- **Method**: `PUT /api/users/{user_id}`
- **Summary**: Update user details.
- **Path Parameters**:
  - `user_id` (integer): ID of the user.
- **Request Body**:
  - **Schema**: `UserUpdate`
- **Responses**:
  - **200**: User updated successfully.
  - **422**: Validation error.

#### **Delete User**
- **Method**: `DELETE /api/users/{user_id}`
- **Summary**: Delete a user.
- **Path Parameters**:
  - `user_id` (integer): ID of the user.
- **Responses**:
  - **204**: User deleted successfully.
  - **422**: Validation error.

---

### Roles (`/api/roles/`)

#### **Get All Roles**
- **Method**: `GET`
- **Summary**: Retrieve all roles.
- **Responses**:
  - **200**: Returns a list of roles.

#### **Create Role**
- **Method**: `POST`
- **Summary**: Create a new role.
- **Request Body**:
  - **Schema**: `RoleCreate`
- **Responses**:
  - **201**: Role created successfully.
  - **422**: Validation error.

#### **Get Role**
- **Method**: `GET /api/roles/{role_id}`
- **Summary**: Retrieve a role by ID.
- **Path Parameters**:
  - `role_id` (integer): ID of the role.
- **Responses**:
  - **200**: Returns the requested role.
  - **422**: Validation error.

#### **Update Role**
- **Method**: `PUT /api/roles/{role_id}`
- **Summary**: Update role details.
- **Path Parameters**:
  - `role_id` (integer): ID of the role.
- **Request Body**:
  - **Schema**: `RoleCreate`
- **Responses**:
  - **200**: Role updated successfully.
  - **422**: Validation error.

#### **Delete Role**
- **Method**: `DELETE /api/roles/{role_id}`
- **Summary**: Delete a role.
- **Path Parameters**:
  - `role_id` (integer): ID of the role.
- **Responses**:
  - **204**: Role deleted successfully.
  - **422**: Validation error.

---

### Permissions (`/api/permissions/`)

#### **Get All Permissions**
- **Method**: `GET`
- **Summary**: Retrieve all permissions.
- **Responses**:
  - **200**: Returns a list of permissions.

#### **Create Permission**
- **Method**: `POST`
- **Summary**: Create a new permission.
- **Request Body**:
  - **Schema**: `PermissionCreate`
- **Responses**:
  - **201**: Permission created successfully.
  - **422**: Validation error.

#### **Get Permission**
- **Method**: `GET /api/permissions/{permission_id}`
- **Summary**: Retrieve a permission by ID.
- **Path Parameters**:
  - `permission_id` (integer): ID of the permission.
- **Responses**:
  - **200**: Returns the requested permission.
  - **422**: Validation error.

#### **Update Permission**
- **Method**: `PUT /api/permissions/{permission_id}`
- **Summary**: Update permission details.
- **Path Parameters**:
  - `permission_id` (integer): ID of the permission.
- **Request Body**:
  - **Schema**: `PermissionCreate`
- **Responses**:
  - **200**: Permission updated successfully.
  - **422**: Validation error.

#### **Delete Permission**
- **Method**: `DELETE /api/permissions/{permission_id}`
- **Summary**: Delete a permission.
- **Path Parameters**:
  - `permission_id` (integer): ID of the permission.
- **Responses**:
  - **204**: Permission deleted successfully.
  - **422**: Validation error.

---

### User-Roles (`/api/user-roles/`)

#### **Assign Role To User**
- **Method**: `POST`
- **Summary**: Assign a role to a user.
- **Request Body**:
  - **Schema**: `UserRoleAssign`
- **Responses**:
  - **201**: Role assigned successfully.
  - **422**: Validation error.

#### **Remove Role From User**
- **Method**: `DELETE`
- **Summary**: Remove a role from a user.
- **Query Parameters**:
  - `user_id` (integer): ID of the user.
  - `role_id` (integer): ID of the role.
- **Responses**:
  - **204**: Role removed successfully.
  - **422**: Validation error.

#### **Get Roles By User**
- **Method**: `GET /api/user-roles/roles/{user_id}`
- **Summary**: Retrieve roles assigned to a specific user.
- **Path Parameters**:
  - `user_id` (integer): ID of the user.
- **Responses**:
  - **200**: Returns roles assigned to the user.
  - **422**: Validation error.

#### **Get Users By Role**
- **Method**: `GET /api/user-roles/users/{role_id}`
- **Summary**: Retrieve users assigned to a specific role.
- **Path Parameters**:
  - `role_id` (integer): ID of the role.
- **Responses**:
  - **200**: Returns users assigned to the role.
  - **422**: Validation error.

---

### Reports (`/api/reports/reports`)

#### **Get Report**
- **Method**: `GET`
- **Summary**: Retrieve reports based on the specified type.
- **Query Parameters**:
  - `report_type` (string): Type of the report.
- **Responses**:
  - **200**: Returns the requested report.
  - **422**: Validation error.

---

### Debug (`/debug-openapi`)

#### **Debug OpenAPI**
- **Method**: `GET`
- **Summary**: Debug the OpenAPI specification.
- **Responses**:
  - **200**: Debug information retrieved successfully.

---

## Schemas

### UserCreate
- **Required**:
  - `username` (string): The username of the user.
  - `email` (string): The email address of the user.
  - `password_hash` (string): The hashed password of the user.
- **Optional**:
  - `is_active` (integer): Whether the user is active.
  - `created_at` (date-time): Creation date of the user.
  - `updated_at` (date-time): Last update date of the user.

### UserResponse
- **Required**:
  - `id` (integer): The unique ID of the user.
  - `username` (string): The username of the user.
  - `email` (string): The email address of the user.
  - `is_active` (integer): Whether the user is active.
  - `created_at` (date-time): The date the user was created.
  - `updated_at` (date-time): The date the user was last updated.

---

For more detailed information about schemas and endpoints, refer to the OpenAPI specification.