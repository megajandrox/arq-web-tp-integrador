from fastapi import Depends, HTTPException
from core.repository import UserRepository
from api.endpoints.schema import UserCreate, UserResponse

class UserService:
    def __init__(self, repo: UserRepository = Depends()):
        self.repo = repo

    def create_user(self, user: UserCreate) -> UserResponse:
        if self.repo.exists(user.email):
            raise HTTPException(status_code=400, detail="Email already exists.")
        return self.repo.save(user)