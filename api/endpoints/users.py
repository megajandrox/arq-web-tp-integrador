from datetime import datetime
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.core.models import User
from api.core.repository import UserRepository
from api.core.services import UserService
from api.endpoints.schema import UserCreate, UserResponse, UserUpdate
from typing import List

router = APIRouter(prefix="/api/users", tags=["users"])

def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(User, db)

def get_user_service(repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(repository)

@router.get("/", response_model=List[UserResponse])
def get_all_users(service: UserService = Depends(get_user_service)):
    return service.get_all()

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, service: UserService = Depends(get_user_service)):
    return service.get_by_id(user_id)

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return service.create(user)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user: UserUpdate,
    service: UserService = Depends(get_user_service)
):
    user.updated_at = datetime.now()
    return service.update(user_id, user)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    service.delete(user_id)
    return None