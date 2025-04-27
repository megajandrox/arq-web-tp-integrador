from fastapi import APIRouter, HTTPException, Depends
from fastapi import status
from api.core.repository import UserRepository
from api.core.services import UserService
from api.endpoints.schema import UserCreate

router = APIRouter()

# Inyección de dependencia de UserService
def get_user_service(repo: UserRepository = Depends()) -> UserService:
    return UserService(repo)

@router.get("/", response_model=list[UserCreate])
def get_all_users(user_service: UserService = Depends(get_user_service)):
    users = user_service.get_all_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@router.get("/{user_id}")
def get_user(user_id: str, user_service: UserService = Depends(get_user_service)):
    user = user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, user_service: UserService = Depends(get_user_service)):
    created_user = user_service.create_user(user)
    return created_user

@router.put("/{user_id}", status_code=status.HTTP_202_ACCEPTED)
async def update_user(user_id: str, user: UserCreate, user_service: UserService = Depends(get_user_service)):
    updated_user = user_service.update_user(user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, user_service: UserService = Depends(get_user_service)):
    success = user_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return  # NO CONTENT
