from datetime import datetime
import pytest
from fastapi.testclient import TestClient
from api.main import app
from api.core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.models import Base, Role, Permission, role_permissions

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
BASE_URI = "/api"

@pytest.fixture
def setup_test_data():
    db = TestingSessionLocal()
    try:
        role = Role(name="Admin", description="Administrator role")
        permission = Permission(name="Read", description="Permission to read data")
        db.add(role)
        db.add(permission)
        db.commit()
        db.refresh(role)
        db.refresh(permission)
        yield
    finally:
        db.query(role_permissions).delete()
        db.query(Permission).delete()
        db.query(Role).delete()
        db.commit()
        db.close()

def test_get_all_roles(setup_test_data):
    response = client.get(f"{BASE_URI}/roles/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Admin"

def test_get_role_by_id(setup_test_data):
    response = client.get(f"{BASE_URI}/roles/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Admin"
    assert data["description"] == "Administrator role"

def test_create_role():
    new_role = {
        "name": "Editor",
        "description": "Editor role"
    }
    response = client.post(f"{BASE_URI}/roles/", json=new_role)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Editor"
    assert data["description"] == "Editor role"

def test_update_role(setup_test_data):
    updated_role = {
        "name": "Super Admin",
        "description": "Updated Administrator role"
    }
    response = client.put(f"{BASE_URI}/roles/1", json=updated_role)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Super Admin"
    assert data["description"] == "Updated Administrator role"

def test_delete_role(setup_test_data):
    response = client.delete(f"{BASE_URI}/roles/1")
    assert response.status_code == 204  # No Content

    response = client.get(f"{BASE_URI}/roles/1")
    assert response.status_code == 404  # Not Found
