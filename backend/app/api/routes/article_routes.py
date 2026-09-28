from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from fastapi.encoders import jsonable_encoder
from app.domain.article import Article
from app.application.article_service import ArticleService
from app.schemas.article_schema import ArticleCreate, ArticleRead, ArticleUpdate
from app.schemas.comment_schema import CommentCreate, CommentRead
from app.application.comment_service import CommentService
# from app.infrastructure.database import open_session
from app.utils.api_response import response_error, response_success
# from sqlalchemy.orm import Session
# from app.schemas.user_schema import UserRead
# from app.api.auth import get_current_user
from app.api.dependency import CommonDeps, get_common_deps

router = APIRouter(prefix="/articles", tags=["articles"])

@router.post("/", response_model = ArticleRead)
def create_article(article:ArticleCreate, common: CommonDeps = Depends(get_common_deps)) -> ArticleRead:
    
    """Cria um novo artigo e o retorna"""
    
    db = common.db
    current_user = common.current_user
    
    try:
        service = ArticleService(db=db)
        
        list_tags = []
        
        for tag in article.tags:
            list_tags.append(service.create_tag(tag))
        
        article_obj = Article(
            title = article.title,
            content = article.content,
            image = article.image,
            author_id = current_user.id,
        )
        
        new_article = service.create_article(
            article_data = article_obj
        )
        
        service.add_tags_to_article(new_article.id, list_tags)
        
        article_created = service.save_data(article = new_article)
        
        return response_success(
            data = jsonable_encoder(article_created),
            status_code = status.HTTP_201_CREATED,
            message = "Artigo criado com sucesso!"
        )
        
    except HTTPException as error:
        return response_error(
            message = error.detail,
            status_code = error.status_code
        )

@router.post("/{article_id}/comments")
def create_comment(article_id:int, comment:CommentCreate, common: CommonDeps = Depends(get_common_deps)) -> CommentRead:
    
    """Criar um novo comentário"""
    
    db = common.db
    current_user = common.current_user
    
    try:
        serviceComment = CommentService(db)
        
        comment_created = serviceComment.create_comment(
            comment_data = comment,
            article_id_data = article_id,
            user_id = current_user.id
        )   
        
        return response_success( 
            data = jsonable_encoder(comment_created),
            message = "Comentário criado com sucesso!"
        )
    
    except HTTPException as error:
        return response_error(
            message = error.detail,
            status_code = error.status_code
        )
    
@router.get("/{article_id}/comments", response_model = list[CommentRead])
def get_comments(article_id:int, common: CommonDeps = Depends(get_common_deps)):
    
    """Pega todos os comentários vinculados ao artigo"""
    
    db = common.db
    
    article_service = ArticleService(db=db)
    article = article_service.check_article(article_id=article_id)
    
    if not article:
        return response_error(
            message="Artigo não encontrado", 
            status_code=status.HTTP_400_BAD_REQUEST
        )
   
    list_comments = article_service.get_all_comments(article.id) 
    
    return response_success(
        data = [jsonable_encoder(comment) for comment in list_comments]
    )
    
@router.get("/")
def get_all_articles(
    common: CommonDeps = Depends(get_common_deps),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = Query(None, description="Busca por título ou conteúdo"),
    tags: Optional[str] = Query(None, description="Tags separadas por vírgula"),
):

    """Função que retorna todos os Articles cadastrados"""

    db = common.db

    service = ArticleService(db=db)
    result = service.get_all_articles(skip, limit, q, tags)
    total = service.count_articles(q, tags)
    
    return response_success(
        data = [jsonable_encoder(article) for article in result],
        pagination = {
            "total": total,
            "skip": skip,
            "limit": limit,
            "pages": (total // limit) + (1 if total % limit else 0)
        }
    )

@router.get("/{article_id}")
def get_article_by_id(article_id: int, common: CommonDeps = Depends(get_common_deps)):
    """Retorna um artigo pelo id"""

    db = common.db
    service = ArticleService(db=db)

    try:
        article = service.get_article(article_id)
        return response_success(data=jsonable_encoder(article))
    except ValueError:
        return response_error(
            message="Artigo não encontrado",
            status_code=status.HTTP_404_NOT_FOUND,
        )
    
@router.put("/{article_id}", response_model = ArticleRead)
def edit_article(article_id:int, article:ArticleCreate, common: CommonDeps = Depends(get_common_deps)) -> ArticleRead:
    
    """Função para atualizar o Article"""
    
    db = common.db
    current_user = common.current_user
    
    try:
        article_service = ArticleService(db=db)
        existing = article_service.check_article(article_id)

        if not existing:
            return response_error(
                message="Artigo não encontrado",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if existing.author_id != current_user.id:
            return response_error(
                message="Sem permissão para editar este artigo",
                status_code=status.HTTP_403_FORBIDDEN,
            )

        article_obj = Article(
            id = article_id,
            title = article.title,
            content = article.content,
            image = article.image,
            author_id = existing.author_id,
            tags = article.tags
        )

        article_updated = article_service.update_article(article_data = article_obj)
        
        return response_success(
            message = "Artigo atualizado com sucesso!",
            data=jsonable_encoder(article_updated)
        )
        
    except ValueError as error:
        return response_error(
            message=str(error),
            status_code=status.HTTP_400_BAD_REQUEST,
        )
    except HTTPException as error:
        return response_error(
            message=error.detail,
            status_code= error.status_code
        )


@router.delete("/{article_id}")
def delete_article(article_id: int, common: CommonDeps = Depends(get_common_deps)):
    """Exclui um artigo (somente o autor)."""

    db = common.db
    current_user = common.current_user

    try:
        ArticleService(db=db).delete_article(article_id, current_user.id)
        return response_success(message="Artigo excluído com sucesso!")
    except ValueError as error:
        return response_error(
            message=str(error),
            status_code=status.HTTP_404_NOT_FOUND,
        )
    except HTTPException as error:
        return response_error(
            message=error.detail,
            status_code=error.status_code,
        )