from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.core.services import PermissionService
from api.core.repository import BaseRepository
from api.core.models import Permission
from api.endpoints.schema import PermissionCreate, PermissionResponse
from typing import List

router = APIRouter(prefix="/permissions", tags=["permissions"])

def get_permission_service(db: Session = Depends(get_db)) -> PermissionService:
    repository = BaseRepository(Permission, db)
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