from datetime import datetime
import pytest
from fastapi.testclient import TestClient
from api.main import app
from api.core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.models import Base, Permission

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
BASE_URI = "/api"  # Base URI para todos los endpoints

@pytest.fixture
def setup_test_data():
    db = TestingSessionLocal()
    try:
        permission = Permission(name="Read", description="Permission to read data")
        db.add(permission)
        db.commit()
        db.refresh(permission)
        yield
    finally:
        db.query(Permission).delete()
        db.commit()
        db.close()

def test_get_all_permissions(setup_test_data):
    response = client.get(f"{BASE_URI}/permissions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Read"

def test_get_permission_by_id(setup_test_data):
    response = client.get(f"{BASE_URI}/permissions/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Read"
    assert data["description"] == "Permission to read data"

def test_create_permission():
    new_permission = {
        "name": "Write",
        "description": "Permission to write data"
    }
    response = client.post(f"{BASE_URI}/permissions/", json=new_permission)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Write"
    assert data["description"] == "Permission to write data"

def test_update_permission(setup_test_data):
    updated_permission = {
        "name": "Read-Only",
        "description": "Updated permission to read data"
    }
    response = client.put(f"{BASE_URI}/permissions/1", json=updated_permission)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Read-Only"
    assert data["description"] == "Updated permission to read data"

def test_delete_permission(setup_test_data):
    response = client.delete(f"{BASE_URI}/permissions/1")
    assert response.status_code == 204  # No Content

    response = client.get(f"{BASE_URI}/permissions/1")
    assert response.status_code == 404  # Not Found