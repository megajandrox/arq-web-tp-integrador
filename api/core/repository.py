from typing import Generic, Type, TypeVar, List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
from api.core.models import User
from api.endpoints.schema import UserCreate

# Define generic types
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