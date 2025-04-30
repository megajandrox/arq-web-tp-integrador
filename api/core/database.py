import sqlite3
from datetime import datetime
from typing import Generator
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

def adapt_datetime(dt):
    return dt.isoformat()

def convert_datetime(value):
    return datetime.fromisoformat(value.decode("utf-8"))

sqlite3.register_adapter(datetime, adapt_datetime)
sqlite3.register_converter("datetime", convert_datetime)


DATABASE_URL = "sqlite:///user_manager.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False, "detect_types": sqlite3.PARSE_DECLTYPES},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base() 

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()