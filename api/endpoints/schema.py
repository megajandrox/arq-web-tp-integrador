from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class Link(BaseModel):
    rel: str
    href: str

class UserCreate(BaseModel):
    username: str
    email: str
    password_hash: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: str
    email: str
    updated_at: Optional[datetime] = None
    is_active: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: int
    created_at: datetime
    updated_at: datetime
    links: List[Link] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class PermissionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PermissionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    links: List[Link] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    permissions: List[PermissionResponse] = []
    links: List[Link] = Field(default_factory=list)
    model_config = ConfigDict(from_attributes=True)

class RolePermissionAssign(BaseModel):
    role_id: int
    permission_id: int

class UserRoleAssign(BaseModel):
    user_id: int
    role_id: int

class UserRolesResponse(BaseModel):
    user_id: int
    roles: List[RoleResponse]
    model_config = ConfigDict(from_attributes=True)


class RoleUsersResponse(BaseModel):
    role_id: int
    users: List[UserResponse]
    model_config = ConfigDict(from_attributes=True)
