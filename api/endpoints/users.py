from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi import status
from api.core.database import Base
from api.endpoints.schema import UserCreate

router = APIRouter()

# Ejemplo con datos en memoria (sin DB)
fake_users_db = {"id": 1, "admin": {"name": "Administrador"}}

@router.get("/{user_id}")
def get_user(user_id: str):
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return fake_users_db[user_id]

@router.post("/")
async def create_user(user: UserCreate, status_code=status.HTTP_201_CREATED):
    # Simulación de guardar en UserCreate base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.put("/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def update_user(user_id: str, user: UserCreate):
    # Simulación de guardar en una base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.patch("/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def partial_update_user(user_id: str, user: UserCreate):
    # Simulación de guardar en una base de datos
    item_with_id = user.model_dump()
    item_with_id["id"] = 1
    return item_with_id

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    if user_id not in fake_users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return  # NOT CONTENT
