from typing import Generic, Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.core.models import Permission, Role, User
from api.endpoints.schema import ActiveUsersReport, PermissionCreate, RoleCreate, UserCreate, UsersByRoleReport, UsersWithoutRolesReport
from api.core.models import user_roles, role_permissions
from sqlalchemy import insert, delete

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType]):
    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get_all(self) -> List[ModelType]:
        """Retrieve all records."""
        return self.db.query(self.model).all()

    def get_by_id(self, obj_id: int) -> Optional[ModelType]:
        """Retrieve a record by its ID."""
        return self.db.query(self.model).filter(self.model.id == obj_id).first()

    def create(self, obj_in: CreateSchemaType) -> ModelType:
        """Create a new record."""
        db_obj = self.model(**obj_in.model_dump())
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, obj_id: int, obj_in: CreateSchemaType) -> Optional[ModelType]:
        """Update an existing record."""
        db_obj = self.get_by_id(obj_id)
        if not db_obj:
            return None
        for key, value in obj_in.model_dump().items():
            setattr(db_obj, key, value)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, obj_id: int) -> bool:
        """Delete a record by its ID."""
        db_obj = self.get_by_id(obj_id)
        if not db_obj:
            return False
        self.db.delete(db_obj)
        self.db.commit()
        return True


class UserRepository(BaseRepository[User, UserCreate]):
    pass

class RoleRepository(BaseRepository[Role, RoleCreate]):
    def __init__(self, model: Role, db: Session):
        super().__init__(model, db)

    def assign_permission_to_role(self, role_id: int, permission_id: int):
        """
        Asigna un permiso a un rol.
        """
        stmt = role_permissions.insert().values(role_id=role_id, permission_id=permission_id)
        self.db.execute(stmt)
        self.db.commit()

    def remove_permission_from_role(self, role_id: int, permission_id: int):
        """
        Elimina un permiso de un rol.
        """
        stmt = role_permissions.delete().where(
            role_permissions.c.role_id == role_id,
            role_permissions.c.permission_id == permission_id
        )
        self.db.execute(stmt)
        self.db.commit()


class UserRoleRepository:
    def __init__(self, db: Session):
        self.db = db

    def assign_role_to_user(self, user_id: int, role_id: int):
        stmt = insert(user_roles).values(user_id=user_id, role_id=role_id)
        self.db.execute(stmt)
        self.db.commit()

    def remove_role_from_user(self, user_id: int, role_id: int):
        stmt = delete(user_roles).where(
            user_roles.c.user_id == user_id,
            user_roles.c.role_id == role_id
        )
        self.db.execute(stmt)
        self.db.commit()

    def get_roles_by_user(self, user_id: int):
        stmt = self.db.query(user_roles).filter(user_roles.c.user_id == user_id)
        return stmt.all()

    def get_users_by_role(self, role_id: int):
        stmt = self.db.query(user_roles).filter(user_roles.c.role_id == role_id)
        return stmt.all()

class PermissionRepository(BaseRepository[Permission, PermissionCreate]):
    def update(self, permission_id: int, permission_in: PermissionCreate) -> Permission:
        permission = self.db.query(Permission).filter(Permission.id == permission_id).first()
        if not permission:
            return None
        for key, value in permission_in.model_dump().items():
            setattr(permission, key, value)
        self.db.commit()
        self.db.refresh(permission)
        return permission

    def delete(self, permission_id: int) -> bool:
        permission = self.db.query(Permission).filter(Permission.id == permission_id).first()
        if not permission:
            return False
        self.db.delete(permission)
        self.db.commit()
        return True

class ReportsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active_users_report(self) -> ActiveUsersReport:
        print("Generating active users report...")
        active_users = self.db.query(User).filter(User.is_active == 1).count()
        inactive_users = self.db.query(User).filter(User.is_active == 0).count()
        total_users = active_users + inactive_users
        print(f"Active users: {active_users}, Inactive users: {inactive_users}, Total users: {total_users}")
        active_percentage = (active_users / total_users) * 100 if total_users > 0 else 0
        return ActiveUsersReport(
            active_users=active_users,
            inactive_users=inactive_users,
            active_percentage=round(active_percentage, 2)
        )

    def get_users_by_role_report(self) -> list[UsersByRoleReport]:
        print("Generating users by role report...")
        roles = self.db.query(Role).all()
        result = []
        for role in roles:
            print(f"Processing role: {role.name}")
            user_count = self.db.query(user_roles).filter(user_roles.c.role_id == role.id).count()
            result.append(UsersByRoleReport(role_name=role.name, user_count=user_count))
        return result

    def get_users_without_roles_report(self) -> list[UsersWithoutRolesReport]:
        users_without_roles = self.db.query(User).outerjoin(user_roles, User.id == user_roles.c.user_id).filter(user_roles.c.role_id == None).all()
        return [
            UsersWithoutRolesReport(user_id=user.id, username=user.username, email=user.email)
            for user in users_without_roles
        ]