import os
import traceback

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import article_routes, user_routes, tag_routes, comments_routes, login_routes

DEBUG = os.getenv("DEBUG", "true").lower() in ("1", "true", "yes")

app = FastAPI(title="TechBlog API", version="1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        content = {"message": "Erro interno do servidor", "details": str(e)}
        if DEBUG:
            content["trace"] = traceback.format_exc().splitlines()
        return JSONResponse(status_code=500, content=content)

app.include_router(article_routes.router)
app.include_router(user_routes.router)
app.include_router(tag_routes.router)
app.include_router(comments_routes.router)
app.include_router(login_routes.router)