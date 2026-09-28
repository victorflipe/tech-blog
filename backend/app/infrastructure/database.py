from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import os


def build_database_url() -> str:
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    database = os.getenv("POSTGRES_DB", "techblog")
    return f"postgresql://{user}:{password}@{host}:{port}/{database}"


DATABASE_URL = build_database_url()
_db_echo = os.getenv("DB_ECHO", "false").lower() in ("1", "true", "yes")

engine = create_engine(DATABASE_URL, echo=_db_echo)
localSession = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

def open_session():
    db:Session = None
    try:
        db = localSession()
        yield db
    finally:
        if db is not None:
            db.close()