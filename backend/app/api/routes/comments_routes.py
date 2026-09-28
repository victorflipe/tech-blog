from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import open_session
from app.application.comment_service import CommentService
from app.schemas.user_schema import UserRead
from app.api.auth import get_current_user
from app.utils.api_response import response_error, response_success
from app.api.dependency import CommonDeps, get_common_deps

router = APIRouter(prefix="/comments", tags=["comments"])

@router.delete("/{comment_id}")
def delete_comment(comment_id:int, common: CommonDeps = Depends(get_common_deps)):
    
    """Deleta o comentário com base no id"""
    
    db = common.db
    current_user = common.current_user
    
    try:
        
        comment_service = CommentService(db=db)
        result_delete = comment_service.delete_comment(comment_id, user_id=current_user.id)

        if not result_delete:
            return response_error(
            message="Comentário não encontrado!"
        )
        
        return response_success(
            message="Comentário excluído com sucesso!"
        )
    
    except Exception as error:
        return response_error(
            message = str(error)
        )
    