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

@pytest.fixture
def setup_test_permissions():
    db = TestingSessionLocal()
    try:
        permission1 = Permission(name="read", description="Permission to read data")
        permission2 = Permission(name="write", description="Permission to write data")
        db.add(permission1)
        db.add(permission2)
        db.commit()
        db.refresh(permission1)
        db.refresh(permission2)
        yield
    finally:
        db.query(Permission).delete()
        db.commit()
        db.close()

def test_get_all_permissions(setup_test_permissions):
    response = client.get("/permissions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "read"
    assert data[1]["name"] == "write"

def test_get_permission_by_id(setup_test_permissions):
    response = client.get("/permissions/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "read"
    assert data["description"] == "Permission to read data"

def test_create_permission():
    new_permission = {
        "name": "delete",
        "description": "Permission to delete data"
    }
    response = client.post("/permissions/", json=new_permission)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "delete"
    assert data["description"] == "Permission to delete data"

def test_update_permission(setup_test_permissions):
    updated_permission = {
        "name": "read-write",
        "description": "Permission to read and write data"
    }
    response = client.put("/permissions/1", json=updated_permission)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "read-write"
    assert data["description"] == "Permission to read and write data"

def test_delete_permission(setup_test_permissions):
    response = client.delete("/permissions/1")
    assert response.status_code == 204  # No Content

    response = client.get("/permissions/1")
    assert response.status_code == 404  # Not Found

    response = client.get("/permissions/")
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "write"