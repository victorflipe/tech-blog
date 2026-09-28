"""Testes de integração Fase 2 (stack Docker rodando).

Execute:
  RUN_INTEGRATION=1 pytest app/tests/test_phase2_integration.py -v
"""

import os
import uuid

import httpx
import pytest

pytestmark = pytest.mark.skipif(
    os.getenv("RUN_INTEGRATION") != "1",
    reason="Defina RUN_INTEGRATION=1 com API em http://localhost:8000",
)

BASE_URL = os.getenv("API_URL", "http://localhost:8000")


def _login(client: httpx.Client, email: str, password: str = "teste") -> str:
    response = client.post(f"{BASE_URL}/login/", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    return response.json()["data"]["access_token"]


def test_search_articles_by_query():
    with httpx.Client() as client:
        token = _login(client, "fredmarques@teste.com")
        response = client.get(
            f"{BASE_URL}/articles/",
            params={"q": "Grão", "limit": 10},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    body = response.json()
    assert "pagination" in body


def test_comment_thread_and_delete_article():
    with httpx.Client() as client:
        token = _login(client, "fredmarques@teste.com")
        headers = {"Authorization": f"Bearer {token}"}
        suffix = uuid.uuid4().hex[:8]

        create = client.post(
            f"{BASE_URL}/articles/",
            headers=headers,
            json={
                "title": f"Fase2 {suffix}",
                "content": "conteudo teste fase 2",
                "image": "",
                "tags": ["fase2"],
            },
        )
        assert create.status_code in (200, 201), create.text
        article_id = create.json()["data"]["id"]

        parent = client.post(
            f"{BASE_URL}/articles/{article_id}/comments",
            headers=headers,
            json={"comment": "comentario raiz"},
        )
        assert parent.status_code == 200, parent.text
        parent_id = parent.json()["data"]["id"]

        reply = client.post(
            f"{BASE_URL}/articles/{article_id}/comments",
            headers=headers,
            json={"comment": "resposta", "parent_comment_id": parent_id},
        )
        assert reply.status_code == 200, reply.text

        listed = client.get(f"{BASE_URL}/articles/{article_id}/comments", headers=headers)
        assert listed.status_code == 200
        roots = listed.json()["data"]
        assert any(
            c["id"] == parent_id and len(c.get("replies", [])) >= 1 for c in roots
        )

        deleted = client.delete(f"{BASE_URL}/articles/{article_id}", headers=headers)
        assert deleted.status_code == 200, deleted.text


def test_register_user():
    suffix = uuid.uuid4().hex[:8]
    with httpx.Client() as client:
        response = client.post(
            f"{BASE_URL}/users/",
            json={
                "name": "Usuario Teste",
                "email": f"teste.{suffix}@teste.com",
                "password": "senha1234",
            },
        )
    assert response.status_code == 200, response.text
