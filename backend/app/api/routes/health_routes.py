from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.infrastructure.database import open_session
from app.utils.api_response import response_error, response_success

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check(db: Session = Depends(open_session)):
    try:
        db.execute(text("SELECT 1"))
        return response_success(
            data={"status": "ok", "database": "connected"},
            message="API saudável",
        )
    except Exception as error:
        return response_error(
            message="Falha na conexão com o banco",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details=str(error),
        )
