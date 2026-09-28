#!/bin/sh

echo "Aguardando Postgres..."
until python -c "
from app.infrastructure.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text('SELECT 1'))
" 2>/dev/null; do
  sleep 2
done

echo "Inicializando schema..."
python -m app.infrastructure.init_db
alembic upgrade head 2>/dev/null || true
python -m app.crud.migrate

echo "Subindo API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level debug