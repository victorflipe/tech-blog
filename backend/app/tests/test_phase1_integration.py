"""Testes de integração (stack Docker rodando).

Execute:
  RUN_INTEGRATION=1 pytest app/tests/test_phase1_integration.py -v
"""

import os

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


def test_get_article_by_id():
    with httpx.Client() as client:
        token = _login(client, "fredmarques@teste.com")
        response = client.get(
            f"{BASE_URL}/articles/1",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    body = response.json()
    assert "Grão Direto" in body["data"]["title"]


def test_put_article_forbidden_for_non_author():
    with httpx.Client() as client:
        token = _login(client, "carloshenrique@teste.com")
        response = client.put(
            f"{BASE_URL}/articles/1",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "title": "Smoke test forbidden",
                "content": "should not apply",
                "image": "",
                "tags": [],
            },
        )
    assert response.status_code == 403
