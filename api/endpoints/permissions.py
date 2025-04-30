from fastapi import APIRouter, Depends, status
from typing import List
from api.core.models import Permission
from api.core.services import PermissionService
from api.core.database import get_db
from api.endpoints.schema import PermissionCreate, PermissionResponse

router = APIRouter(prefix="/permissions", tags=["permissions"])

def get_permission_service(db=Depends(get_db)) -> PermissionService:
    from api.core.repository import PermissionRepository
    repository = PermissionRepository(Permission, db)
    return PermissionService(repository)

@router.get("/", response_model=List[PermissionResponse])
def get_all_permissions(service: PermissionService = Depends(get_permission_service)):
    return service.get_all()

@router.get("/{permission_id}", response_model=PermissionResponse)
def get_permission(permission_id: int, service: PermissionService = Depends(get_permission_service)):
    return service.get_by_id(permission_id)

@router.post("/", response_model=PermissionResponse, status_code=status.HTTP_201_CREATED)
def create_permission(permission: PermissionCreate, service: PermissionService = Depends(get_permission_service)):
    return service.create(permission)

@router.put("/{permission_id}", response_model=PermissionResponse)
def update_permission(permission_id: int, permission: PermissionCreate, service: PermissionService = Depends(get_permission_service)):
    return service.update(permission_id, permission)

@router.delete("/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_permission(permission_id: int, service: PermissionService = Depends(get_permission_service)):
    service.delete(permission_id)
    return