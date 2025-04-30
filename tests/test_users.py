import pytest
from fastapi.testclient import TestClient
from api.main import app
from api.core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.models import Base, User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def setup_test_data():
    db = TestingSessionLocal()
    try:
        user1 = User(username="testuser1", email="test1@example.com", password_hash="hashedpassword1", is_active=1, created_at="2025-01-01", updated_at="2025-01-01")
        user2 = User(username="testuser2", email="test2@example.com", password_hash="hashedpassword2", is_active=1, created_at="2025-01-01", updated_at="2025-01-01")
        db.add(user1)
        db.add(user2)
        db.commit()
        db.refresh(user1)
        db.refresh(user2)
        yield
    finally:
        db.query(User).delete()
        db.commit()
        db.close()

def test_get_all_users(setup_test_data):
    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["username"] == "testuser1"
    assert data[1]["username"] == "testuser2"

def test_get_user_by_id(setup_test_data):
    response = client.get("/users/1")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser1"
    assert data["email"] == "test1@example.com"

def test_create_user():
    new_user = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password_hash": "hashedpassword3",
        "is_active": 1,
        "created_at": "2025-01-01",
        "updated_at": "2025-01-01"
    }
    response = client.post("/users/", json=new_user)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "newuser@example.com"

def test_update_user(setup_test_data):
    updated_user = {
        "username": "updateduser",
        "email": "updateduser@example.com",
        "password_hash": "updatedpassword",
        "is_active": 1,
        "created_at": "2025-01-01",
        "updated_at": "2025-01-02"
    }
    response = client.put("/users/1", json=updated_user)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "updateduser"
    assert data["email"] == "updateduser@example.com"
    assert data["updated_at"].startswith("2025-01-02")

def test_delete_user(setup_test_data):
    response = client.delete("/users/1")
    assert response.status_code == 204  # No Content

    response = client.get("/users/1")
    assert response.status_code == 404  # Not Found

    response = client.get("/users/")
    data = response.json()
    assert len(data) == 1
    assert data[0]["username"] == "testuser2"