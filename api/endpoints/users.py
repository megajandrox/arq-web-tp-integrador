from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class UserRequest(BaseModel):
    username: str
    email: str

# Ejemplo con datos en memoria (sin DB)
fake_users_db = {"admin": {"name": "Administrador"}}

@router.get("/{user_id}")
def get_user(user_id: str):
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return fake_users_db[user_id]

@router.post("/")
async def create_user(user: UserRequest):
    # Simulación de guardar en una base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.put("/{user_id}")
async def update_user(user_id: str, user: UserRequest):
    # Simulación de guardar en una base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.patch("/{user_id}")
async def partial_update_user(user_id: str, user: UserRequest):
    # Simulación de guardar en una base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.delete("/{user_id}")
async def delete_user(user_id: str):
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return fake_users_db[user_id]