# GitHub Project — TechBlog (challenge-gd)

Este repositório usa **Issues** + **Sub-issues** (épicos) para o backlog. O board Kanban fica no **GitHub Project** da sua conta, vinculado a `victorflipe/challenge-gd`.

## Criar o project (uma vez)

1. Abra [Novo project](https://github.com/users/victorflipe/projects/new).
2. Escolha o template **Board**.
3. Nome sugerido: **TechBlog — Backlog & Tasks**.
4. Em **⋯ → Settings → Manage access**, adicione o repositório **challenge-gd**.

## Campos recomendados

| Campo | Valores |
|-------|--------|
| Status | Todo · In Progress · In Review · Done |
| Priority | P0 · P1 · P2 |
| Fase | 1 · 2 · 3 · 4 |

## Épicos (issues pai)

| Issue | Épico |
|-------|--------|
| [#1](https://github.com/victorflipe/challenge-gd/issues/1) | Fase 1 — Estabilizar MVP |
| [#4](https://github.com/victorflipe/challenge-gd/issues/4) | Fase 2 — Completar funcionalidades |
| [#5](https://github.com/victorflipe/challenge-gd/issues/5) | Fase 3 — Qualidade, testes e CI |
| [#3](https://github.com/victorflipe/challenge-gd/issues/3) | Fase 4 — Polish e hardening |
| [#2](https://github.com/victorflipe/challenge-gd/issues/2) | Meta — Configuração do Project |

## Workflow sugerido

1. Novas tarefas: **Issues → New issue → Task** (template) ou sub-issue de um épico.
2. No Project: **Add items from repository** → selecione issues abertas.
3. Opcional: **Workflows** → auto-adicionar issues do repo; mover para **Done** ao fechar a issue.

## Labels

Labels usadas nos épicos: `epic`, `fase-1` … `fase-4`, `priority:P0` … `priority:P2`, `meta`, `project`.

Ao criar issues pelo template, aplique labels manualmente até existirem no repositório.

## CLI (opcional)

Com [GitHub CLI](https://cli.github.com/) autenticado:

```bash
gh project create --owner victorflipe --title "TechBlog — Backlog & Tasks" --format json
gh project link <PROJECT_NUMBER> --owner victorflipe --repo challenge-gd
```
