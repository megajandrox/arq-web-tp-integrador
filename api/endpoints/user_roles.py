from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.core.models import Role, User
from api.core.repository import RoleRepository, UserRepository, UserRoleRepository
from api.core.services import RoleService, UserRoleService, UserService
from api.endpoints.roles import get_role_service
from api.endpoints.schema import RoleResponse, RoleUsersResponse, UserResponse, UserRoleAssign, UserRolesResponse
from api.endpoints.users import get_user_service

router = APIRouter(prefix="/user-roles", tags=["user_roles"])

def get_user_role_repository(db: Session = Depends(get_db)) -> UserRoleRepository:
    return UserRoleRepository(db)

def get_user_role_service(repository: UserRoleRepository = Depends(get_user_role_repository)) -> UserRoleService:
    return UserRoleService(repository)

@router.post("/", status_code=status.HTTP_201_CREATED)
def assign_role_to_user(
    user_role: UserRoleAssign,
    service: UserRoleService = Depends(get_user_role_service)
):
    service.assign_role_to_user(user_role.user_id, user_role.role_id)
    return {"message": "Role assigned to user successfully"}

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def remove_role_from_user(
    user_id: int,
    role_id: int,
    service: UserRoleService = Depends(get_user_role_service)
):
    service.remove_role_from_user(user_id, role_id)
    return None

@router.get("/roles/{user_id}", response_model=UserRolesResponse)
def get_roles_by_user(
    user_id: int,
    service: UserRoleService = Depends(get_user_role_service),
    service_role: RoleService = Depends(get_role_service)
):
    user_roles = service.get_roles_by_user(user_id)
    if not user_roles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No roles found for this user")
    
    roles = [service_role.get_by_id(user_role.role_id) for user_role in user_roles]
    roles_response = [RoleResponse.from_orm(role) for role in roles]
    
    return UserRolesResponse(user_id=user_id, roles=roles_response)

@router.get("/users/{role_id}")
def get_users_by_role(
    role_id: int,
    service: UserRoleService = Depends(get_user_role_service),
    service_user: UserService = Depends(get_user_service)
):
    user_roles = service.get_users_by_role(role_id)
    if not user_roles:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No users found for this role")
    users = [service_user.get_by_id(user_role.user_id) for user_role in user_roles]
    users_response = [UserResponse.from_orm(user) for user in users]
    return RoleUsersResponse(role_id=role_id, users=users_response)
