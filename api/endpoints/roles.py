from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.core.models import Role
from api.core.repository import RoleRepository
from api.core.services import RoleService
from api.endpoints.schema import RoleCreate, RolePermissionAssign, RoleResponse
from typing import List

router = APIRouter(prefix="/api/roles", tags=["roles"])

def get_role_repository(db: Session = Depends(get_db)) -> RoleRepository:
    return RoleRepository(Role, db)

def get_role_service(db: Session = Depends(get_db)) -> RoleService:
    repository = RoleRepository(Role, db)
    return RoleService(repository)

@router.get("/", response_model=List[RoleResponse])
def get_all_roles(service: RoleService = Depends(get_role_service)):
    return service.get_all()

@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, service: RoleService = Depends(get_role_service)):
    return service.get_by_id(role_id)

@router.post("/", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
def create_role(
    role: RoleCreate,
    service: RoleService = Depends(get_role_service)
):
    return service.create(role)

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int,
    role: RoleCreate,
    service: RoleService = Depends(get_role_service)
):
    return service.update(role_id, role)

@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(
    role_id: int,
    service: RoleService = Depends(get_role_service)
):
    service.delete(role_id)
    return None

@router.post("/{role_id}/permissions", status_code=status.HTTP_201_CREATED)
def assign_permission_to_role(
    role_permission: RolePermissionAssign,
    service: RoleService = Depends(get_role_service)
):
    service.assign_permission_to_role(role_permission.role_id, role_permission.permission_id)
    return {"message": "Permission assigned to role successfully"}

@router.delete("/{role_id}/permissions", status_code=status.HTTP_204_NO_CONTENT)
def remove_permission_from_role(
    role_permission: RolePermissionAssign,
    service: RoleService = Depends(get_role_service)
):
    service.remove_permission_from_role(role_permission.role_id, role_permission.permission_id)
    return {"message": "Permission removed from role successfully"}
