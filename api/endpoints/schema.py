from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class Link(BaseModel):
    rel: str
    href: str

class UserCreate(BaseModel):
    username: str
    email: str
    password_hash: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    is_active: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: int
    created_at: str
    updated_at: str
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
    class Config:
        orm_mode = True


class RoleUsersResponse(BaseModel):
    role_id: int
    users: List[UserResponse]
    class Config:
        orm_mode = True
