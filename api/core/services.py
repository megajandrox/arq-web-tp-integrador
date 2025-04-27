from fastapi import Depends, HTTPException
from api.core.repository import UserRepository
from api.endpoints.schema import UserCreate, UserResponse

class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    def create_user(self, user: UserCreate) -> UserResponse:
        if self.repo.exists(user.email):
            raise HTTPException(status_code=400, detail="Email already exists.")
        return self.repo.save(user)
    
    def get_user(self, user_id: int) -> UserResponse:
        user = self.repo.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return user
    def update_user(self, user_id: int, user: UserCreate) -> UserResponse:
        existing_user = self.repo.get_user(user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found.")
        return self.repo.update_user(user_id, user)
    def delete_user(self, user_id: int) -> bool:
        existing_user = self.repo.get_user(user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found.")
        return self.repo.delete_user(user_id)
    def get_all_users(self) -> list[UserResponse]:
        users = self.repo.get_all_users()
        if not users:
            raise HTTPException(status_code=404, detail="No users found.")
        return users
