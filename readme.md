# TechBlog

Projeto MVP para Compartilhamento de Artigos onde é possível:
- Publicar Artigos com suas TAGs correspondentes
- Comentar nos artigos 
- E fazer a busca por TAGs ou pelo título dos artigos

## Tecnologias utilizadas
- **FastAPI** – Backend em Python
- **Postgres** – Banco de dados relacional
- **Vite** – Frontend em React

## Pré-requisitos
- Docker e Docker Compose instalados na sua máquina

## Como executar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/victorflipe/challenge-gd.git
cd challenge-gd
```

2. Configure o ambiente da API:
```bash
cp backend/.env.example backend/.env
```
Edite `backend/.env` se necessário (senha do Postgres, `SECRET_KEY`).

3. Execute os containers
```bash
docker compose up --build -d
```

Isso irá executar:
- Healthcheck do Postgres antes de subir a API
- Criação das tabelas e seed idempotente (`articles.json`)
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

### Reset completo do banco (desenvolvimento)

```bash
docker compose down -v
# No serviço api, defina DEV_RESET=1 no .env ou environment para drop_all no init_db
docker compose up --build -d
```

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

## Acessando a aplicação

Para acessar a aplicação, basta pegar um usuário que está no json para popular o banco e fazer o seguinte:

- Utilize o primeiro nome + segundo nome + "@teste.com". (Exemplo: victorfelipe@teste.com)
- A senha para todos os usuários do json é "teste"


