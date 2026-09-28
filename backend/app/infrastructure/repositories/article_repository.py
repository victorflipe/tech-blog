from sqlalchemy import desc, or_
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.domain.article import Article
from app.domain.tag import Tag
from app.infrastructure.models.tag_model import TagModel
from app.infrastructure.models.comment_model import CommentModel
from app.infrastructure.models.article_model import ArticleModel
from typing import Optional

class ArticleRepository:
    
    def __init__(self, db:Session):
        self.db = db
    
    def save(self, article:Article) -> Article:
        try:
            
            article_obj = ArticleModel(
                title=article.title,
                content=article.content,
                image=article.image,
                author_id=article.author_id
            )
            
            self.db.add(article_obj)
            self.db.flush()
            return article_obj
        
        except IntegrityError as error:
            self.db.rollback()
            raise ValueError("Erro de integridade")
            
        except SQLAlchemyError as error:
            self.db.rollback()
            raise ValueError("Erro no banco de dados")
    
    
    def update(self, article:Article) -> Article:
        
        article_found = self.db.query(ArticleModel).filter_by(id=article.id).first()
            
        if article_found:
            article_found.title = article.title
            article_found.content = article.content
            article_found.image = article.image
        
            self.db.flush()
            self.save_data(article_found)
            return article_found
    
    
    def save_data(self, article:Article) -> Article:
        self.db.commit()
        return article
    
    def add_tags_to_article(self, article_id: int, list_tags: list[TagModel]) -> list[TagModel]:
        
        article = self.db.query(ArticleModel).filter_by(id=article_id).first()
        
        if article.tags is None:
            return []
        
        for tag in list_tags:
            if tag not in article.tags:
                article.tags.append(tag)
        
        return article.tags
    
    def update_tags_to_article(self, article_id:int, list_tags_remove:Optional[list[Tag]], list_tags_add:Optional[list[Tag]]) -> list[TagModel]:
        tags_removed = self.remove_tags_to_article(article_id, list_tags_remove)
        tags_added = self.add_tags_to_article(article_id, list_tags_add)
        return tags_removed + tags_added
        
    
    def remove_tags_to_article(self, article_id:int, list_tags_remove:list[Tag]) -> list[TagModel]:
        
        article = self.db.query(ArticleModel).filter_by(id=article_id).first()
        
        # article.tags = [tag for tag in article.tags if tag.id not in list_tags_remove]
        for tag in list_tags_remove:
            if tag in article.tags:
                article.tags.remove(tag)
            
        self.db.flush()
        self.db.refresh(article)
        
        return article.tags
    
    def _articles_query(self, q: str | None = None, tags: str | None = None):
        query = self.db.query(ArticleModel)
        if q:
            pattern = f"%{q.strip()}%"
            query = query.filter(
                or_(
                    ArticleModel.title.ilike(pattern),
                    ArticleModel.content.ilike(pattern),
                )
            )
        if tags:
            for raw in tags.split(","):
                name = raw.strip()
                if name:
                    query = query.filter(
                        ArticleModel.tags.any(TagModel.tag.ilike(name))
                    )
        return query

    def get_all_articles(
        self, skip: int, limit: int, q: str | None = None, tags: str | None = None
    ) -> list[ArticleModel]:
        return (
            self._articles_query(q, tags)
            .order_by(desc(ArticleModel.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_articles(self, q: str | None = None, tags: str | None = None) -> int:
        return self._articles_query(q, tags).count()

    def delete(self, article_id: int) -> bool:
        article = self.db.query(ArticleModel).filter_by(id=article_id).first()
        if not article:
            return False
        self.db.delete(article)
        self.db.commit()
        return True
    
    def get_all_tags_to_article(self, article_id:int) -> Optional[list[TagModel]]:
        article_obj = self.db.query(ArticleModel).filter_by(id=article_id).first()
        return article_obj.tags if article_obj else None
    
    def check_article(self, article_id:int) -> Article:
        return self.db.query(ArticleModel).filter_by(id=article_id).first()
    
    def get_all_comments(self, article_id:int) -> list[CommentModel]:
        return self.db.query(CommentModel).filter_by(article_id=article_id).order_by(desc(CommentModel.created_at)).all()
    