from typing import List
from pydantic import BaseModel, ConfigDict

class UserCreate(BaseModel):
    username: str
    email: str
    
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    model_config = ConfigDict(from_attributes=True)

class RoleCreate(BaseModel):
    name: str
    description: str | None = None
    
    model_config = ConfigDict(from_attributes=True)

class RoleResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    
    model_config = ConfigDict(from_attributes=True)

class UserRoleAssign(BaseModel):
    user_id: int
    role_id: int

class UserRolesResponse(BaseModel):
    user_id: int
    roles: List[RoleResponse]
    class Config:
        orm_mode = True
    #model_config = ConfigDict(from_attributes=True)


class RoleUsersResponse(BaseModel):
    role_id: int
    users: List[UserResponse]
    class Config:
        orm_mode = True
    #cmodel_config = ConfigDict(from_attributes=True)
