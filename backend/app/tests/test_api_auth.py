from fastapi.testclient import TestClient

from app.infrastructure.models.user_model import UserModel
from app.tests.conftest import auth_header


def test_login_success(client: TestClient, author_user: UserModel):
    response = client.post(
        "/login/",
        json={"email": author_user.email, "password": "teste"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["data"]["access_token"]
    assert body["data"]["token_type"] == "bearer"


def test_login_invalid_password(client: TestClient, author_user: UserModel):
    response = client.post(
        "/login/",
        json={"email": author_user.email, "password": "errada"},
    )
    assert response.status_code == 401


def test_register_user(client: TestClient):
    response = client.post(
        "/users/",
        json={
            "name": "Novo Usuario",
            "email": "novo.usuario@teste.com",
            "password": "senha1234",
        },
    )
    assert response.status_code == 200, response.text
    assert response.json()["data"]["email"] == "novo.usuario@teste.com"


def test_public_list_articles_without_token(client: TestClient):
    response = client.get("/articles/", params={"limit": 5})
    assert response.status_code == 200


def test_create_article_requires_auth(client: TestClient):
    response = client.post(
        "/articles/",
        json={
            "title": "Sem auth",
            "content": "conteudo",
            "image": "",
            "tags": [],
        },
    )
    assert response.status_code == 401
