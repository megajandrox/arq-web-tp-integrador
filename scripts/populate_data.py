import requests
import json

BASE_URL = "http://localhost:5000/api"

def create_permission(name, description):
    response = requests.post(
        f"{BASE_URL}/permissions/",
        headers={"Content-Type": "application/json"},
        json={"name": name, "description": description},
    )
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error al crear permiso {name}: {response.json()}")
        return None

def create_role(name, description):
    json = {
        "name": name,
        "description": description
    }
    print(f"Creando rol: {json}")
    response = requests.post(
        f"{BASE_URL}/roles/",
        headers={"Content-Type": "application/json"},
        json={"name": name, "description": description},
    )
    print(f"Response: {response.status_code} - {response.text}")
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error al crear rol {name}: {response.json()}")
        return None

def create_user(username, email, password_hash):
    response = requests.post(
        f"{BASE_URL}/users/",
        headers={"Content-Type": "application/json"},
        json={"username": username, "email": email, "password_hash": password_hash},
    )
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error al crear usuario {username}: {response.json()}")
        return None

def assign_role_to_user(user_id, role_id):
    data = {
        "user_id": user_id,
        "role_id": role_id
    }
    print(f"Asignando rol {role_id} a usuario {user_id}")
    response = requests.post(
        f"{BASE_URL}/user-roles/",
        headers={"Content-Type": "application/json"},
        json=data,
    )
    if response.status_code != 201:
        print(f"Error al asignar rol {role_id} al usuario {user_id}: {response.json()}")

def assign_permission_to_role(role_id, permission_id):
    response = requests.post(
        f"{BASE_URL}/roles/{role_id}/permissions",
        headers={"Content-Type": "application/json"},
        json={"role_id": role_id, "permission_id": permission_id},
    )
    if response.status_code != 201:
        print(f"Error al asignar permiso {permission_id} al rol {role_id}: {response.json()}")

def get_roles_by_user(user_id):
    response = requests.get(f"{BASE_URL}/user-roles/roles/{user_id}")
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error al obtener roles del usuario {user_id}: {response.json()}")
        return None

def get_users_by_role(role_id):
    response = requests.get(f"{BASE_URL}/user-roles/users/{role_id}")
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error al obtener usuarios del rol {role_id}: {response.json()}")
        return None

def main():
    print("Carga de datos inicial...")
    print("Creando roles...")
    role_admin = create_role("Admin", "Administrator role")
    role_user = create_role("User", "Regular user role")

    if not role_admin or not role_user:
        print("Error al crear roles. Abortando.")
        pass

    role_admin_id = role_admin["id"]
    role_user_id = role_user["id"]
    print(f"Roles creados: Admin ID={role_admin_id}, User ID={role_user_id}")

    print("Creando permisos...")
    permission_read = create_permission("read", "Permission to read data")
    permission_write = create_permission("write", "Permission to write data")

    if not permission_read or not permission_write:
        print("Error al crear permisos. Abortando.")
        return

    permission_read_id = permission_read["id"]
    permission_write_id = permission_write["id"]
    print(f"Permisos creados: Read ID={permission_read_id}, Write ID={permission_write_id}")

    print("Asignando permisos a roles...")
    assign_permission_to_role(role_admin_id, permission_read_id)
    assign_permission_to_role(role_admin_id, permission_write_id)
    assign_permission_to_role(role_user_id, permission_read_id)
    print("Permisos asignados a roles.")

    print("Creando usuarios...")
    user_pepe = create_user("pepe", "pepe@example.com", "hashedpassword1")
    user_cacho = create_user("cacho", "cacho@example.com", "hashedpassword2")
    print(f"Usuarios creados: Pepe ID={user_pepe['id']}, Cacho ID={user_cacho['id']}")
    if not user_pepe or not user_cacho:
        print("Error al crear usuarios. Abortando.")
        pass

    user_pepe_id = user_pepe["id"]
    user_cacho_id = user_cacho["id"]
    print(f"Usuarios creados: Pepe ID={user_pepe_id}, Cacho ID={user_cacho_id}")

    print("Asignando roles a usuarios...")
    assign_role_to_user(user_pepe_id, role_admin_id)
    assign_role_to_user(user_cacho_id, role_user_id)
    print("Roles asignados a usuarios.")

    print("Verificando datos creados...")
    print("Usuarios con roles:")
    print(json.dumps(get_roles_by_user(user_pepe_id), indent=4))
    print(json.dumps(get_roles_by_user(user_cacho_id), indent=4))

    print("Roles con usuarios:")
    print(json.dumps(get_users_by_role(role_admin_id), indent=4))
    print(json.dumps(get_users_by_role(role_user_id), indent=4))

    print("Datos poblados exitosamente.")

if __name__ == "__main__":
    main()