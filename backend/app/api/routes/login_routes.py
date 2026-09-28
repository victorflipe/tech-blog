from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.application.user_service import UserService
from app.core.limiter import LOGIN_RATE_LIMIT, limiter
from app.infrastructure.database import open_session
from app.schemas.user_schema import UserLogin
from app.utils.api_response import response_error, response_success

router = APIRouter(prefix="/login", tags=["login"])


@router.post("/")
@limiter.limit(LOGIN_RATE_LIMIT)
def user_login(
    request: Request,
    user_credentials: UserLogin,
    db: Session = Depends(open_session),
):
    
    try:
        user_service = UserService(db)
        token = user_service.login(user_credentials)

        if token:
        
            return response_success(
                data = {
                    "access_token": token,
                    "token_type": "bearer",
                },
                message= "Usuário logado com sucesso!"
            )
            
    except ValueError as error:
        return response_error(
            message = str(error),
            status_code = status.HTTP_401_UNAUTHORIZED  
        )
        