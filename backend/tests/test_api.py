import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to SmartCart API"}

def test_login_invalid_user():
    response = client.post(
        "/api/auth/login",
        data={"username": "invalid@example.com", "password": "wrongpassword"}
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Incorrect email or password"}

def test_get_active_offers():
    response = client.get("/api/offers/active")
    assert response.status_code == 200
    # Should return a list
    assert isinstance(response.json(), list)

def test_get_products_unauthorized():
    # Since products are open to all for viewing
    response = client.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_manager_endpoint_unauthorized():
    # Without token, should be 401
    response = client.get("/api/manager/staff")
    assert response.status_code == 401
