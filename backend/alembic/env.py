import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.infrastructure.database import Base, build_database_url

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import models so Base.metadata is populated for autogenerate.
from app.infrastructure.models.user_model import UserModel  # noqa: F401
from app.infrastructure.models.article_model import ArticleModel  # noqa: F401
from app.infrastructure.models.comment_model import CommentModel  # noqa: F401
from app.infrastructure.models.tag_model import TagModel  # noqa: F401
from app.infrastructure.models.article_tag_model import article_tag  # noqa: F401

target_metadata = Base.metadata


def get_url() -> str:
    return os.getenv("DATABASE_URL") or build_database_url()


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section) or {}
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
