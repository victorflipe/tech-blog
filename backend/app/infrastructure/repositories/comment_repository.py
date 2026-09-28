from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from app.domain.comment import Comment
from app.domain.article import Article
from app.schemas.comment_schema import CommentRead
from app.infrastructure.models.comment_model import CommentModel
from typing import List

class CommentRepository:
    
    def __init__(self, db:Session):
        self.db = db
    
    def save(self, comment:Comment) -> Comment:
        try:
            comment_obj = CommentModel(
                comment=comment.comment,
                author_id=comment.author_id,
                article_id=comment.article_id,
                parent_comment_id=comment.parent_comment_id
            )
            self.db.add(comment_obj)
            self.db.commit()
            self.db.refresh(comment_obj)
            return comment_obj
        
        except IntegrityError as error:
            self.db.rollback()
            raise ValueError(error)
            
        except ValueError as error:
            raise ValueError(error)
            
        except SQLAlchemyError as error:
            self.db.rollback()
            raise ValueError(error)
        
    def get_all_comments(self, article_id: int) -> List[CommentModel]:
        return (
            self.db.query(CommentModel)
            .filter_by(article_id=article_id)
            .order_by(CommentModel.created_at.asc())
            .all()
        )
        
    def delete_comment(self, comment_id:int, user_id:int) -> bool:
        comment = self.db.query(CommentModel).filter(
            CommentModel.id == comment_id
        ).filter(
            CommentModel.author_id == user_id
        ).first()
        
        if not comment:
            return False
        
        self.db.delete(comment)
        self.db.commit()
        return True