from fastapi import Depends
from sqlalchemy.orm import Session
from api.core.database import get_db
from api.endpoints.schema import UserCreate
from api.core.models import User

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
    
    def get_user(self, user_id: int) -> User:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def update_user(self, user_id: int, user: UserCreate) -> User:
        db_user = self.get_user(user_id)
        if db_user:
            for key, value in user.dict().items():
                setattr(db_user, key, value)
            self.db.commit()
            return db_user
        return None
    def delete_user(self, user_id: int) -> bool:
        db_user = self.get_user(user_id)
        if db_user:
            self.db.delete(db_user)
            self.db.commit()
            return True
        return False
    def get_all_users(self) -> list[User]:
        return self.db.query(User).all()
