# Smoke E2E — Fase 1

Checklist manual/automatizado para validar estabilização do MVP.

## Pré-requisitos

1. Copie `backend/.env.example` → `backend/.env`
2. Suba o stack: `docker compose up --build -d`
3. Aguarde healthcheck do Postgres e startup da API (logs: `docker logs techblog_api -f`)

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API / Swagger | http://localhost:8000/docs |
| Postgres (host) | `localhost:5434` → container `5432` |

Se a porta **5432** do host estiver livre, altere em `docker-compose.yml` para `"5432:5432"`.

## Credenciais seed

- Email: `{primeiro}{segundo}@teste.com` (ex.: `fredmarques@teste.com`)
- Senha: `teste`

## Smoke via MCP Playwright (Cursor)

Com o stack no ar, peça ao agente:

> Rode smoke E2E da Fase 1 com MCP Playwright

Cenários esperados:

| # | Cenário | Esperado |
|---|---------|----------|
| 1 | Login Fred | Redirect `/articles` |
| 2 | Lista | “Todos os Artigos” + artigos do seed |
| 3 | `/articles/1` | Título com “Grão Direto” |
| 4 | Reload em `/articles/1` | Mesmo conteúdo |
| 5 | Network `GET /articles/1` | Header `Authorization: Bearer` |
| 6 | Sem token em `/articles` | Redirect `/login` |
| 7 | Login Carlos + artigo Fred | Sem ícone “edit article” |

## Smoke API (403 autorização)

Com Docker rodando:

```bash
cd backend
pip install pytest httpx
RUN_INTEGRATION=1 pytest app/tests/test_phase1_integration.py -v
```

Ou PowerShell (host com `pytest` instalado):

```powershell
cd backend
$env:RUN_INTEGRATION = "1"
pytest app/tests/test_phase1_integration.py -v
```

Via container (recomendado se não tiver pytest local):

```bash
docker exec -e RUN_INTEGRATION=1 techblog_api pytest app/tests/test_phase1_integration.py -v
```

## Reset completo do banco (dev)

```bash
docker compose down -v
DEV_RESET=1 docker compose up --build -d
```

`DEV_RESET=1` faz `drop_all` antes de `alembic upgrade head` no `init_db`.

## Problemas comuns

| Sintoma | Ação |
|---------|------|
| Seed vazio / “relation articles does not exist” | `docker exec techblog_api sh backend/scripts/start-api.sh` ou reinicie após DB healthy |
| Conflito porta 5432 | Use mapeamento `5434:5432` (padrão atual) ou pare o outro Postgres |
| Auth failed no Postgres | `docker compose down -v` e recrie volume com `.env` consistente |
