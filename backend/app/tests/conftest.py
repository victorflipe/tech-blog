"""Fixtures para testes com TestClient (Postgres de teste ou CI)."""

import os

# Defina variáveis antes de importar app/database (usa techblog_test por padrão).
os.environ.setdefault("PYTEST_POSTGRES_DB", "techblog_test")
os.environ["POSTGRES_DB"] = os.environ["PYTEST_POSTGRES_DB"]
os.environ.setdefault("POSTGRES_USER", "postgres")
os.environ.setdefault("POSTGRES_PASSWORD", "postgres")
os.environ.setdefault("POSTGRES_HOST", "localhost")
os.environ.setdefault("POSTGRES_PORT", "5432")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("DEBUG", "false")
os.environ.setdefault("DB_ECHO", "false")

from collections.abc import Generator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session, sessionmaker

from app.api.auth import get_password_hash
from app.infrastructure.database import engine, open_session
from app.infrastructure.models.user_model import UserModel
from app.main import app

from app.infrastructure.models.article_model import ArticleModel  # noqa: F401
from app.infrastructure.models.comment_model import CommentModel  # noqa: F401
from app.infrastructure.models.tag_model import TagModel  # noqa: F401
from app.infrastructure.models.article_tag_model import article_tag  # noqa: F401


def _alembic_config() -> Config:
    ini_path = Path(__file__).resolve().parents[2] / "alembic.ini"
    return Config(str(ini_path))


@pytest.fixture(scope="session", autouse=True)
def apply_migrations():
    command.upgrade(_alembic_config(), "head")
    yield


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection, autocommit=False, autoflush=False)()
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_open_session() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[open_session] = override_open_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def author_user(db_session: Session) -> UserModel:
    user = UserModel(
        name="Autor Teste",
        email="autor@teste.com",
        password=get_password_hash("teste"),
    )
    db_session.add(user)
    db_session.flush()
    return user


@pytest.fixture
def other_user(db_session: Session) -> UserModel:
    user = UserModel(
        name="Outro Usuario",
        email="outro@teste.com",
        password=get_password_hash("teste"),
    )
    db_session.add(user)
    db_session.flush()
    return user


def auth_header(client: TestClient, email: str, password: str = "teste") -> dict[str, str]:
    response = client.post("/login/", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    token = response.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
