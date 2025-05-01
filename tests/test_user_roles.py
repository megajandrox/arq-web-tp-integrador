import pytest
from fastapi.testclient import TestClient
from api.main import app
from api.core.database import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from api.core.models import Base, User, Role, user_roles

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
def setup_test_user_roles():
    db = TestingSessionLocal()
    try:
        user1 = User(username="testuser1", email="test1@example.com", password_hash="hashedpassword1", is_active=1, created_at="2025-01-01", updated_at="2025-01-01")
        user2 = User(username="testuser2", email="test2@example.com", password_hash="hashedpassword2", is_active=1, created_at="2025-01-01", updated_at="2025-01-01")
        role1 = Role(name="Admin", description="Administrator role")
        role2 = Role(name="User", description="Regular user role")
        db.add_all([user1, user2, role1, role2])
        db.commit()

        db.execute(user_roles.insert().values(user_id=1, role_id=1))
        db.execute(user_roles.insert().values(user_id=2, role_id=2))
        db.commit()

        yield
    finally:
        db.query(Role).delete()
        db.query(User).delete()
        db.commit()

        db.execute(user_roles.delete())
        db.commit()
        db.close()

def test_assign_role_to_user():
    new_user_role = {
        "user_id": 1,
        "role_id": 1
    }
    response = client.post("/user-roles/", json=new_user_role)
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == 'Role assigned to user successfully'
