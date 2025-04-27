from fastapi import Depends
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.endpoints.schema import UserCreate
from core.models import User

class UserRepository:
    def __init__(self, db: Session = Depends(get_db)):
        self.db = db

    def exists(self, email: str) -> bool:
        return self.db.query(User).filter(User.email == email).first() is not None

    def save(self, user: UserCreate) -> User:
        db_user = User(**user.dict())
        self.db.add(db_user)
        self.db.commit()
        return db_user