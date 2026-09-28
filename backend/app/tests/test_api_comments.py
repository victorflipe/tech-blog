from fastapi.testclient import TestClient

from app.infrastructure.models.user_model import UserModel
from app.tests.conftest import auth_header


def test_list_comments_public(client: TestClient, author_user: UserModel):
    headers = auth_header(client, author_user.email)
    create = client.post(
        "/articles/",
        headers=headers,
        json={
            "title": "Artigo publico comentarios",
            "content": "conteudo",
            "image": "",
            "tags": [],
        },
    )
    article_id = create.json()["data"]["id"]
    response = client.get(f"/articles/{article_id}/comments")
    assert response.status_code == 200


def test_comment_thread(client: TestClient, author_user: UserModel):
    headers = auth_header(client, author_user.email)
    create = client.post(
        "/articles/",
        headers=headers,
        json={
            "title": "Artigo comentarios",
            "content": "conteudo",
            "image": "",
            "tags": [],
        },
    )
    article_id = create.json()["data"]["id"]

    parent = client.post(
        f"/articles/{article_id}/comments",
        headers=headers,
        json={"comment": "comentario raiz"},
    )
    assert parent.status_code == 200, parent.text
    parent_id = parent.json()["data"]["id"]

    reply = client.post(
        f"/articles/{article_id}/comments",
        headers=headers,
        json={"comment": "resposta", "parent_comment_id": parent_id},
    )
    assert reply.status_code == 200, reply.text

    listed = client.get(f"/articles/{article_id}/comments", headers=headers)
    assert listed.status_code == 200
    roots = listed.json()["data"]
    assert any(
        c["id"] == parent_id and len(c.get("replies", [])) >= 1 for c in roots
    )
