import json
from pathlib import Path
from app.infrastructure.database import localSession
from app.application.user_service import UserService
from app.application.article_service import ArticleService
from app.application.tag_service import TagService
from app.schemas.user_schema import UserCreate
from app.schemas.article_schema import ArticleCreate
from app.infrastructure.models.article_model import ArticleModel

def migrate_articles():
    json_path = Path(__file__).parent.parent / "data" / "articles.json"
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    db = localSession()

    try:
        if db.query(ArticleModel).count() > 0:
            print("Seed ignorado: banco já contém artigos.")
            return

        user_service = UserService(db)
        article_service = ArticleService(db)
        tag_service = TagService(db)

        for item in data:
            
            author_name = item["author"]
            user = user_service.get_by_name(author_name)
            
            if not user:
                name_parts = author_name.strip().split(" ")
                first_name = name_parts[0].lower()
                second_name = name_parts[1].lower() if len(name_parts) > 1 else ""
                email = f"{first_name}{second_name}@teste.com"

                user = user_service.create_user(
                    UserCreate(
                        name=author_name,
                        email=email,
                        password="teste"
                    )
                )

            article = article_service.create_article(
                ArticleCreate(
                    title=item["title"],
                    content=item["content"],
                    image=item.get("image"),
                    author_id=user.id
                )
            )

            list_tags = []
            for key in ["tag1", "tag2", "tag3"]:
                tag_name = item.get(key)
                if tag_name:
                    tag_name_clean = tag_name.strip().lower()
                    tag = tag_service.get_by_name(tag_name_clean)
                    if not tag:
                        tag = tag_service.create_tag(tag_name_clean)
                    if tag not in list_tags:
                        list_tags.append(tag)

            if list_tags:
                article_service.add_tags_to_article(article.id, list_tags=list_tags)

        print("Migração concluída com sucesso!")

    except Exception as e:
        db.rollback()
        print("Erro na migração:", e)
    finally:
        db.close()

if __name__ == "__main__":
    migrate_articles()
