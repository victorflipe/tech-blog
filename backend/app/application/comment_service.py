from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.domain.comment import Comment
from app.domain.article import Article
from app.infrastructure.repositories.comment_repository import CommentRepository
from app.infrastructure.models.comment_model import CommentModel
from app.schemas.comment_schema import CommentCreate, CommentRead

class CommentService:
    
    def __init__(self, db:Session):
        self.repository = CommentRepository(db)
        self.db = db
        
    def create_comment(self, comment_data:CommentCreate, article_id_data:int, user_id:int) -> CommentRead:

        if comment_data.parent_comment_id is not None:
            parent = (
                self.db.query(CommentModel)
                .filter_by(
                    id=comment_data.parent_comment_id,
                    article_id=article_id_data,
                )
                .first()
            )
            if not parent:
                raise HTTPException(
                    status_code=400,
                    detail="Comentário pai inválido para este artigo",
                )

        comment = Comment(
            comment = comment_data.comment,
            author_id = user_id,
            article_id = article_id_data,
            parent_comment_id = comment_data.parent_comment_id
        )
        
        comment_saved = self.repository.save(comment)
        self.db.refresh(comment_saved, attribute_names=["author"])

        return CommentRead.model_validate(comment_saved).model_copy(update={"replies": []})

    def get_all_comments(self, article_id: int) -> list[CommentRead]:
        list_comments = self.repository.get_all_comments(article_id)
        return [CommentRead.model_validate(comment) for comment in list_comments]
    
    def delete_comment(self, comment_id:int, user_id:int) -> bool:
        return self.repository.delete_comment(comment_id, user_id)