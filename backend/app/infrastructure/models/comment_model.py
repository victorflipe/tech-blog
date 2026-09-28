from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from ..database import Base as BaseModel

class CommentModel(BaseModel):
    
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    comment = Column(Text, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    
    time = datetime.now
    
    created_at = Column(DateTime, default = time)
    updated_at = Column(DateTime, default = time, onupdate=datetime.now)
    
    author = relationship("UserModel", back_populates="comments")
    article = relationship("ArticleModel", back_populates="comments")
    parent = relationship(
        "CommentModel",
        remote_side=[id],
        back_populates="replies",
        foreign_keys=[parent_comment_id],
    )
    replies = relationship(
        "CommentModel",
        back_populates="parent",
        cascade="all, delete-orphan",
        foreign_keys=[parent_comment_id],
    )
    