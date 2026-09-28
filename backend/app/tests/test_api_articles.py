from fastapi.testclient import TestClient

from app.infrastructure.models.user_model import UserModel
from app.tests.conftest import auth_header


def test_create_and_get_article(client: TestClient, author_user: UserModel):
    headers = auth_header(client, author_user.email)
    create = client.post(
        "/articles/",
        headers=headers,
        json={
            "title": "Artigo pytest",
            "content": "Conteudo do artigo",
            "image": "",
            "tags": ["pytest"],
        },
    )
    assert create.status_code in (200, 201), create.text
    article_id = create.json()["data"]["id"]

    fetched = client.get(f"/articles/{article_id}", headers=headers)
    assert fetched.status_code == 200
    assert fetched.json()["data"]["title"] == "Artigo pytest"


def test_search_articles(client: TestClient, author_user: UserModel):
    headers = auth_header(client, author_user.email)
    client.post(
        "/articles/",
        headers=headers,
        json={
            "title": "Busca unique xyz",
            "content": "texto",
            "image": "",
            "tags": [],
        },
    )
    response = client.get(
        "/articles/",
        headers=headers,
        params={"q": "unique", "limit": 10},
    )
    assert response.status_code == 200
    assert "pagination" in response.json()


def test_put_article_forbidden_for_non_author(
    client: TestClient,
    author_user: UserModel,
    other_user: UserModel,
):
    author_headers = auth_header(client, author_user.email)
    create = client.post(
        "/articles/",
        headers=author_headers,
        json={
            "title": "So autor edita",
            "content": "conteudo",
            "image": "",
            "tags": [],
        },
    )
    article_id = create.json()["data"]["id"]

    other_headers = auth_header(client, other_user.email)
    response = client.put(
        f"/articles/{article_id}",
        headers=other_headers,
        json={
            "title": "Tentativa",
            "content": "nao deve aplicar",
            "image": "",
            "tags": [],
        },
    )
    assert response.status_code == 403


def test_delete_own_article(client: TestClient, author_user: UserModel):
    headers = auth_header(client, author_user.email)
    create = client.post(
        "/articles/",
        headers=headers,
        json={
            "title": "Para deletar",
            "content": "conteudo",
            "image": "",
            "tags": [],
        },
    )
    article_id = create.json()["data"]["id"]
    deleted = client.delete(f"/articles/{article_id}", headers=headers)
    assert deleted.status_code == 200, deleted.text
