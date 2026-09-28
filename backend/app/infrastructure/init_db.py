import os
from pathlib import Path

from alembic import command
from alembic.config import Config

from .database import Base, engine
from .models.user_model import UserModel  # noqa: F401
from .models.article_model import ArticleModel  # noqa: F401
from .models.comment_model import CommentModel  # noqa: F401
from .models.tag_model import TagModel  # noqa: F401
from .models.article_tag_model import article_tag  # noqa: F401


def _alembic_config() -> Config:
    ini_path = Path(__file__).resolve().parents[2] / "alembic.ini"
    return Config(str(ini_path))


def init_db():
    reset = os.getenv("DEV_RESET", "").lower() in ("1", "true", "yes")
    if reset:
        Base.metadata.drop_all(bind=engine)
        print("DEV_RESET: tabelas removidas.")

    command.upgrade(_alembic_config(), "head")
    print("Schema aplicado via Alembic (head).")


if __name__ == "__main__":
    init_db()
