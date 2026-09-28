import os

from .database import Base, engine
from .models.user_model import UserModel
from .models.article_model import ArticleModel
from .models.comment_model import CommentModel
from .models.tag_model import TagModel


def init_db():
    reset = os.getenv("DEV_RESET", "").lower() in ("1", "true", "yes")
    if reset:
        Base.metadata.drop_all(bind=engine)
        print("DEV_RESET: tabelas removidas.")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas ou já existentes.")


if __name__ == "__main__":
    init_db()
