import pytest
from fastapi.testclient import TestClient
from api.main import app
from api.core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.models import Base, Role

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
def setup_test_roles():
    db = TestingSessionLocal()
    try:
        role1 = Role(name="Admin", description="Administrator role")
        role2 = Role(name="User", description="Regular user role")
        db.add(role1)
        db.add(role2)
        db.commit()
        db.refresh(role1)
        db.refresh(role2)
        yield
    finally:
        db.query(Role).delete()
        db.commit()
        db.close()

def test_get_all_roles(setup_test_roles):
    response = client.get("/roles/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Admin"
    assert data[1]["name"] == "User"

def test_get_role_by_id(setup_test_roles):
    response = client.get("/roles/1")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Admin"
    assert data["description"] == "Administrator role"

def test_create_role():
    new_role = {
        "name": "Manager",
        "description": "Manager role"
    }
    response = client.post("/roles/", json=new_role)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Manager"
    assert data["description"] == "Manager role"

def test_update_role(setup_test_roles):
    updated_role = {
        "name": "SuperAdmin",
        "description": "Updated administrator role"
    }
    response = client.put("/roles/1", json=updated_role)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "SuperAdmin"
    assert data["description"] == "Updated administrator role"

def test_delete_role(setup_test_roles):
    response = client.delete("/roles/1")
    assert response.status_code == 204  # No Content

    response = client.get("/roles/1")
    assert response.status_code == 404  # Not Found

    response = client.get("/roles/")
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "User"