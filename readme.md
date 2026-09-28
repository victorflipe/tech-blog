# TechBlog

Blog editorial inspirado no Medium: artigos em Markdown, tags, busca e comentários em thread. Leitura é pública; escrever, editar e comentar exige conta.

## Visão geral

O pedido sai do browser, passa pelo SPA (React + Vite), chega na API FastAPI, segue pelos services e pelo SQLAlchemy até o PostgreSQL 16.

![Fluxo da aplicação TechBlog](docs/screenshots/infografico-techblog.png)

| | Sem login | Com login |
|---|---|---|
| Artigos | Listar, ler, filtrar por título ou tag | Criar, editar e excluir os próprios |
| Comentários | Ver threads | Comentar e responder |
| Conta | Cadastro e login | Perfil; JWT no `localStorage` |

Conteúdo do artigo é Markdown (com preview no editor). Screenshots das telas: [wiki — Telas da aplicação](docs/wiki/Telas-da-Aplicação.md).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router |
| API | Python 3.11, FastAPI, Pydantic, Uvicorn |
| Dados | PostgreSQL 16, SQLAlchemy 2, Alembic |
| Auth | JWT (HS256), bcrypt; rate limit no `POST /login/` (5/min) |
| Execução | Docker Compose |

## Como executar

Requisito: Docker Compose.

```bash
git clone https://github.com/victorflipe/tech-blog.git
cd tech-blog
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build -d
```

A subida espera o Postgres ficar healthy, aplica migrations Alembic, faz seed de `backend/app/data/articles.json` e sobe os três serviços:

| Serviço | URL |
|---|---|
| App | http://localhost:5173 |
| API / Swagger | http://localhost:8000/docs |
| Health | http://localhost:8000/health |
| Postgres (host) | `localhost:5434` → container `5432` |

Usuário e senha do banco (padrão): `postgres` / `postgres`, database `techblog`. Logs da API: `docker logs techblog_api -f`.

### Primeiro acesso

Contas do seed: e-mail `{primeiro}{segundo}@teste.com` (ex.: `fredmarques@teste.com`) e senha `teste`.

### Comandos

```bash
docker compose down          # para
docker compose down -v       # para e apaga o volume do Postgres
docker compose up --build -d # sobe de novo
```

Detalhes de migration, reset (`DEV_RESET`) e problemas comuns: [docs/SMOKE_E2E.md](docs/SMOKE_E2E.md).

## Testes e CI

Com o stack no ar:

```bash
docker exec -e RUN_INTEGRATION=1 techblog_api pytest app/tests/test_phase1_integration.py app/tests/test_phase2_integration.py -v
```

No GitHub Actions (push/PR em `main` e `dev`): migrations, pytest com TestClient, `compileall`, build das imagens e `npm run lint`. Checklist de smoke no browser: [docs/SMOKE_E2E.md](docs/SMOKE_E2E.md).

## Repositório

```
.
├── backend/            # API (domain → application → infrastructure → rotas)
├── frontend/           # SPA Vite
├── docs/               # Wiki local, smoke, screenshots
└── docker-compose.yml
```

Trabalho em Git: branches a partir de `dev`, PR, Conventional Commits — [wiki](docs/wiki/Home.md). Backlog: [docs/GITHUB_PROJECT.md](docs/GITHUB_PROJECT.md).
