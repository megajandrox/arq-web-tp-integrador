from typing import Generic, TypeVar, List
from fastapi import HTTPException, status
from pydantic import BaseModel
from api.core.models import User
from api.core.repository import BaseRepository, UserRepository
from api.endpoints.schema import UserCreate, UserResponse

# Define generic types
ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseService(Generic[ModelType, CreateSchemaType]):
    def __init__(self, repository: BaseRepository[ModelType, CreateSchemaType]):
        self.repository = repository

    def get_all(self) -> List[ModelType]:
        """Retrieve all records."""
        return self.repository.get_all()

    def get_by_id(self, obj_id: int) -> ModelType:
        """Retrieve a record by its ID."""
        obj = self.repository.get_by_id(obj_id)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        return obj

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record."""
        try:
            return self.repository.create(obj_in)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    def update(self, obj_id: int, obj_in: BaseModel) -> ModelType:
        """Update an existing record."""
        obj = self.repository.update(obj_id, obj_in)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        return obj

    def delete(self, obj_id: int) -> bool:
        """Delete a record by its ID."""
        success = self.repository.delete(obj_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        return True

class UserService(BaseService[User, UserCreate]):
    def __init__(self, repository: UserRepository):
        super().__init__(repository)

    def get_all(self) -> List[UserResponse]:
        """Get all users with response schema conversion."""
        users = super().get_all()
        return [UserResponse.model_validate(user) for user in users] 
    
    def get_by_id(self, user_id: int) -> UserResponse:
        """Get user by ID with response schema conversion."""
        user = super().get_by_id(user_id)
        return UserResponse.model_validate(user)

    def create(self, user_in: UserCreate) -> UserResponse:
        """Create user with response schema conversion."""
        user = super().create(user_in)
        return UserResponse.model_validate(user)

    def update(self, user_id: int, user_in: UserCreate) -> UserResponse:
        """Update user with response schema conversion."""
        user = super().update(user_id, user_in)
        return UserResponse.model_validate(user)