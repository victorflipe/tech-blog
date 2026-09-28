# GitHub Project — TechBlog (tech-blog)

Este repositório usa **Issues** + **Sub-issues** (épicos) para o backlog. O board Kanban fica no **GitHub Project** da sua conta, vinculado a `victorflipe/tech-blog`.

## Criar o project (uma vez)

1. Abra [Novo project](https://github.com/users/victorflipe/projects/new).
2. Escolha o template **Board**.
3. Nome sugerido: **TechBlog — Backlog & Tasks**.
4. Em **⋯ → Settings → Manage access**, adicione o repositório **tech-blog**.

## Campos recomendados

| Campo | Valores |
|-------|--------|
| Status | Todo · In Progress · In Review · Done |
| Priority | P0 · P1 · P2 |
| Fase | 1 · 2 · 3 · 4 |

## Épicos (issues pai)

| Issue | Épico |
|-------|--------|
| [#1](https://github.com/victorflipe/tech-blog/issues/1) | Fase 1 — Estabilizar MVP |
| [#4](https://github.com/victorflipe/tech-blog/issues/4) | Fase 2 — Completar funcionalidades |
| [#5](https://github.com/victorflipe/tech-blog/issues/5) | Fase 3 — Qualidade, testes e CI |
| [#3](https://github.com/victorflipe/tech-blog/issues/3) | Fase 4 — Polish e hardening |
| [#2](https://github.com/victorflipe/tech-blog/issues/2) | Meta — Configuração do Project |

## Sub-tarefas (#6–#23)

Tarefas filhas estão vinculadas aos épicos acima. Veja a aba **Sub-issues** em cada épico no GitHub.

## Workflow sugerido

1. Novas tarefas: **Issues → New issue → Task** (template) ou sub-issue de um épico.
2. No Project: **Add items from repository** → selecione issues abertas.
3. Opcional: **Workflows** → auto-adicionar issues do repo; mover para **Done** ao fechar a issue.

## Labels

Labels nos épicos: `epic`, `fase-1` … `fase-4`, `priority:P0` … `priority:P2`, `meta`, `project`.

## Skill do Cursor (mover cards ao implementar)

Agentes devem carregar a skill do repositório (formato Cursor: `SKILL.md` com frontmatter):

`.cursor/skills/challenge-gd-github-tasks/SKILL.md`

Seções principais: **Instructions**, **Examples**, **Configuration**, **Utility scripts**. Combina MCP GitHub (issues) + `scripts/move-task.ps1` (GitHub CLI) para as colunas Todo → In Progress → In Review → Done.

Setup do CLI:

```powershell
gh auth login
# Opcional: preencher projectNumber em .cursor/skills/challenge-gd-github-tasks/project.json
.\.cursor\skills\challenge-gd-github-tasks\scripts\move-task.ps1 -Issue 6 -Status in_progress
```

## Smoke E2E (Fase 1)

Ver [SMOKE_E2E.md](SMOKE_E2E.md) — MCP Playwright, testes de integração (`pytest`) e troubleshooting do Docker.

## CLI (opcional)

Com [GitHub CLI](https://cli.github.com/) autenticado:

```bash
gh project create --owner victorflipe --title "TechBlog — Backlog & Tasks" --format json
gh project link <PROJECT_NUMBER> --owner victorflipe --repo tech-blog
```
