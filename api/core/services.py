from datetime import datetime
from typing import Generic, TypeVar, List
from fastapi import HTTPException, status
from pydantic import BaseModel
from api.core.models import Role, User
from api.core.repository import BaseRepository, RoleRepository, UserRepository, UserRoleRepository
from api.endpoints.schema import RoleCreate, RoleResponse, UserCreate, UserResponse
from api.lib.security import hash_password

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseService(Generic[ModelType, CreateSchemaType]):
    def __init__(self, repository: BaseRepository[ModelType, CreateSchemaType]):
        self.repository = repository

    def get_all(self) -> List[ModelType]:
        return self.repository.get_all()

    def get_by_id(self, obj_id: int) -> ModelType:
        obj = self.repository.get_by_id(obj_id)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        return obj

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        try:
            return self.repository.create(obj_in)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    def update(self, obj_id: int, obj_in: BaseModel) -> ModelType:
        obj = self.repository.update(obj_id, obj_in)
        if not obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Object not found"
            )
        return obj

    def delete(self, obj_id: int) -> bool:
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
        users = super().get_all()
        return [UserResponse.model_validate(user) for user in users] 
    
    def get_by_id(self, user_id: int) -> UserResponse:
        user = super().get_by_id(user_id)
        return UserResponse.model_validate(user)

    def create(self, user_in: UserCreate) -> UserResponse:
        now = datetime.now()
        user_in.created_at = now
        user_in.updated_at = now
        user_in.is_active = 1
        user_in.password_hash = hash_password(user_in.password_hash)
        print(user_in)
        user = super().create(user_in)
        return UserResponse.model_validate(user)

    def update(self, user_id: int, user_in: UserCreate) -> UserResponse:
        user = super().update(user_id, user_in)
        return UserResponse.model_validate(user)
    
class RoleService(BaseService[Role, RoleCreate]):
    def __init__(self, repository: RoleRepository):
        super().__init__(repository)

    def get_all(self) -> List[RoleResponse]:
        roles = super().get_all()
        return [RoleResponse.model_validate(role) for role in roles] 
    
    def get_by_id(self, role_id: int) -> RoleResponse:
        role = super().get_by_id(role_id)
        return RoleResponse.model_validate(role)

    def create(self, role_in: RoleCreate) -> RoleResponse:
        print(f" Creating role {role_in}")
        role = super().create(role_in)
        return RoleResponse.model_validate(role)

    def update(self, role_id: int, role_in: RoleCreate) -> RoleResponse:
        user = super().update(role_id, role_in)
        return RoleResponse.model_validate(user)


class UserRoleService:
    def __init__(self, repository: UserRoleRepository):
        self.repository = repository

    def assign_role_to_user(self, user_id: int, role_id: int):
        self.repository.assign_role_to_user(user_id, role_id)

    def remove_role_from_user(self, user_id: int, role_id: int):
        self.repository.remove_role_from_user(user_id, role_id)

    def get_roles_by_user(self, user_id: int):
        return self.repository.get_roles_by_user(user_id)

    def get_users_by_role(self, role_id: int):
        return self.repository.get_users_by_role(role_id)