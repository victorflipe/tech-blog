# TechBlog

Projeto MVP para Compartilhamento de Artigos onde é possível:
- Publicar Artigos com suas TAGs correspondentes
- Comentar nos artigos 
- E fazer a busca por TAGs ou pelo título dos artigos

## Visão geral

Do navegador ao banco: o pedido passa por React/Vite, FastAPI, a camada de services e o SQLAlchemy até o PostgreSQL 16.

![Fluxo da aplicação TechBlog](docs/screenshots/infografico-techblog.png)

## Tecnologias utilizadas
- **FastAPI** – Backend em Python
- **Postgres** – Banco de dados relacional
- **Vite** – Frontend em React

## Pré-requisitos
- Docker e Docker Compose instalados na sua máquina

## Como executar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/victorflipe/tech-blog.git
cd tech-blog
```

2. Configure o ambiente:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
Edite `backend/.env` se necessário (senha do Postgres, `SECRET_KEY`). No frontend, `VITE_API_URL` aponta para a API (padrão `http://localhost:8000`).

3. Execute os containers
```bash
docker compose up --build -d
```

Isso irá executar:
- Healthcheck do Postgres antes de subir a API
- **Migrations Alembic** (`alembic upgrade head`) e seed idempotente (`articles.json`)
- Backend FastAPI na porta **8000**
- Frontend Vite na porta **5173**
- Postgres no host na porta **5434** (mapeamento `5434→5432` no container; evita conflito se já existir Postgres em 5432)

Para expor Postgres em **5432** no host, altere `docker-compose.yml` para `"5432:5432"` quando a porta estiver livre.

4. Acesse o frontend pelo endereço:
```bash
http://localhost:5173
```

5. Acesse a documentação da API em:
```bash
http://localhost:8000/docs
```

### Leitura pública vs área autenticada (Fase 4)

- **Público (sem login):** listar artigos, ler artigo, listar comentários e tags.
- **Autenticado:** criar/editar/excluir artigos, comentar, responder threads, cadastro e perfil.
- **Health check:** `GET http://localhost:8000/health` (ping ao Postgres; usado no healthcheck do container `api`).
- **Rate limit:** `POST /login/` limitado por IP (`LOGIN_RATE_LIMIT`, padrão `5/minute`).
- **Markdown:** conteúdo dos artigos é renderizado em Markdown na leitura; preview opcional no formulário.

### Reset completo do banco (desenvolvimento)

```bash
docker compose down -v
# Opcional: DEV_RESET=1 no backend/.env remove tabelas antes do Alembic no próximo up
docker compose up --build -d
```

### Banco já existente (upgrade para Alembic)

Se o Postgres já tinha tabelas criadas com `create_all` e o `alembic upgrade` falhar com “relation already exists”:

```bash
docker exec techblog_api alembic stamp head
docker compose restart api
```

Ou recrie o volume com `docker compose down -v`.

### Migrations (Alembic)

Com o stack no ar ou Postgres acessível:

```bash
cd backend
alembic upgrade head          # aplicar
alembic revision --autogenerate -m "descricao"   # nova migration (dev)
```

## Testes automatizados (Fase 3)

**TestClient + Postgres** (CI e local; usa o banco `techblog_test` por padrão):

```bash
# Crie o banco de teste uma vez (Docker):
docker exec techblog_db psql -U postgres -c "CREATE DATABASE techblog_test;"

cd backend
pip install -r requirements.txt
set PYTEST_POSTGRES_HOST=localhost
set PYTEST_POSTGRES_PORT=5434
pytest app/tests/test_api_auth.py app/tests/test_api_articles.py app/tests/test_api_comments.py -v
```

**Integração E2E** (API em `http://localhost:8000`):

```bash
docker exec -e RUN_INTEGRATION=1 techblog_api pytest app/tests/test_phase1_integration.py app/tests/test_phase2_integration.py -v
```

A pipeline **GitHub Actions** (`.github/workflows/ci.yml`) roda migrations, pytest (TestClient), compile check, build Docker e `npm run lint` no frontend.

## Testes smoke (Fase 1)

- **E2E no browser (MCP Playwright no Cursor):** ver [docs/SMOKE_E2E.md](docs/SMOKE_E2E.md)
- **API (403 autorização, GET artigo):** com o stack no ar:

```bash
docker exec -e RUN_INTEGRATION=1 techblog_api pytest app/tests/test_phase1_integration.py -v
```

Ou no host: `pip install pytest httpx` e `RUN_INTEGRATION=1 pytest app/tests/test_phase1_integration.py -v` dentro de `backend/`.

Comandos úteis

- Para todos os containers
```bash
docker compose down
```

- Sobe todos os containers
```bash
docker compose up --build -d
```

- Logs da API (seed / erros)
```bash
docker logs techblog_api -f
```

## Estrutura do Projeto
```bash
.
├── backend/       # Código da API FastAPI
├── frontend/      # Código do frontend Vite/React
├── docker-compose.yml
└── README.md
```

## Estrutura do backend
```bash
backend
├── .venv
├── app
│ ├── api
│ ├── application
│ ├── config
│ ├── crud
│ ├── data
│ ├── domain
│ ├── infrastructure
│ ├── schemas
│ ├── tests
│ ├── utils
│ └── main.py
├── .env
├── .env.example
├── scripts/start-api.sh
├── alembic.ini
├── Dockerfile
└── requirements.txt
```

## Estrutura do frontend
```bash
├── dist
├── node_modules
├── public
├── src
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tailwind.config.js
└── vite.config.js
```



