---
name: challenge-gd-github-tasks
description: >-
  Creates and updates GitHub issues and moves Project board cards for
  victorflipe/tech-blog (TechBlog). Use when starting or finishing
  implementation, when the user asks to move a task or card, when creating
  backlog items, or when mentioning GitHub Project, TechBlog epics, or issues
  #6–#23.
disable-model-invocation: true
---

# GitHub Tasks — challenge-gd

Sincronize **issue** (MCP `user-github`) e **coluna do board** (script + `gh`) sempre que o código avançar. O Project já existe na UI.

## Instructions

### Regras

1. Issue é a fonte da verdade: título, corpo, comentários e fechamento via MCP `user-github`.
2. Coluna do board: `scripts/move-task.ps1` (requer GitHub CLI autenticado). Se `gh` falhar, atualize a issue e informe o usuário.
3. Antes de criar issue: `search_issues` ou `list_issues` em `victorflipe/tech-blog`.
4. Não faça commit só por mover task (commit apenas se o usuário pedir).

### Repositório e épicos

| Campo | Valor |
|-------|--------|
| Owner | `victorflipe` |
| Repo | `tech-blog` |
| Board | GitHub Project — título em `project.json` |

| Issue | Épico |
|-------|--------|
| #1 | Fase 1 — Estabilizar MVP |
| #4 | Fase 2 — Completar funcionalidades |
| #5 | Fase 3 — Qualidade, testes e CI |
| #3 | Fase 4 — Polish e hardening |
| #2 | Meta — Project (pode estar fechada) |

### Status: board ↔ issue

| Coluna (UI) | Alias script | Issue (MCP) |
|-------------|--------------|-------------|
| Todo | `todo` | `state: open` |
| In Progress | `in_progress` | `open` + comentário opcional |
| In Review | `in_review` | `open` |
| Done | `done` | `closed`, `state_reason: completed` |

| Momento de trabalho | Alias | Ação extra na issue |
|---------------------|-------|---------------------|
| Começou a codar | `in_progress` | Comentário: escopo, branch ou PR |
| PR em revisão | `in_review` | Comentário com link do PR |
| Entrega concluída | `done` | Fechar + resumo no comentário |
| Escopo cancelado | `done` ou `todo` | `state_reason: not_planned` se fechar |

### Fluxo ao implementar

1. Identificar o **número da issue** (pedido do usuário, PR ou busca por título).
2. Mover para **In Progress** (script abaixo).
3. Implementar.
4. Se houver PR: **In Review** + comentário na issue.
5. Ao concluir: **Done** (script) + `issue_write` `update` com `state: closed`, `state_reason: completed`.

Se a issue não estiver no board, rodar `scripts/add-task-to-project.ps1` antes de mover.

### Criar nova task

1. `search_issues` para evitar duplicata.
2. Escolher épico pai (#1, #4, #5 ou #3).
3. `issue_write` — `method: create`, `owner`, `repo`, `parent_issue_number` (épico), `title` `[Task] …`, `body` com critérios de aceite. Omitir `labels` se o repo retornar "label not found".
4. `add-task-to-project.ps1 -Issue <N>`
5. `move-task.ps1 -Issue <N> -Status todo` (ou `in_progress` se for trabalhar já).

Preferir `parent_issue_number` em `issue_write` em vez de `sub_issue_write` (evita confundir issue number com `sub_issue_id`).

### MCP (sem `gh`)

| Ferramenta | Uso |
|------------|-----|
| `issue_write` | Criar, atualizar, fechar |
| `add_issue_comment` | Progresso |
| `list_issues` / `search_issues` | Buscar task |

Mover coluna do Project **não** está no MCP — use script ou UI.

### Fallback sem GitHub CLI

1. Comentário + abrir/fechar issue conforme tabela de status.
2. Pedir movimentação manual em [Projects](https://github.com/users/victorflipe/projects) ou instalação do [GitHub CLI](https://cli.github.com/).

### Checklist do agente

```
- [ ] Issue # identificada
- [ ] Card movido (script ou fallback informado)
- [ ] Comentário na issue se relevante
- [ ] Issue fechada se Done
```

## Examples

**Exemplo 1 — Iniciar issue #6**

```powershell
./.cursor/skills/challenge-gd-github-tasks/scripts/move-task.ps1 -Issue 6 -Status in_progress
```

MCP: `add_issue_comment` — body curto indicando início (ex.: branch ou arquivos alvo).

**Exemplo 2 — Concluir issue #7**

```powershell
./.cursor/skills/challenge-gd-github-tasks/scripts/move-task.ps1 -Issue 7 -Status done
```

MCP: `issue_write` — `method: update`, `issue_number: 7`, `state: closed`, `state_reason: completed`, comentário com o que foi entregue.

**Exemplo 3 — Nova sub-task na Fase 1 (épico #1)**

MCP `issue_write`:

- `method: create`
- `owner: victorflipe`, `repo: tech-blog`
- `parent_issue_number: 1`
- `title: "[Task] Validar token no interceptor fetch"`
- `body`: problema, critérios de aceite, paths

Depois:

```powershell
./.cursor/skills/challenge-gd-github-tasks/scripts/add-task-to-project.ps1 -Issue <NOVA>
./.cursor/skills/challenge-gd-github-tasks/scripts/move-task.ps1 -Issue <NOVA> -Status todo
```

**Exemplo 4 — Card ausente no board**

Erro do script: issue não está no project → `add-task-to-project.ps1 -Issue N` → repetir `move-task.ps1`.

## Configuration

Arquivo [project.json](project.json) (usado pelos scripts):

| Campo | Descrição |
|-------|-----------|
| `owner` / `repo` | Repositório GitHub |
| `projectTitle` | Título exato do board na UI |
| `projectNumber` | Número do project; `null` = auto-detect por título |
| `statusFieldName` | Nome do campo (padrão `Status`) |
| `statusOptions` | Mapa alias → rótulo na UI |

Setup único:

```bash
gh auth login
gh project list --owner victorflipe --format json
```

Copiar `number` do board para `projectNumber` se a auto-detecção falhar. Ajustar `statusOptions` se os nomes das colunas na UI forem diferentes.

Labels já usadas nos épicos: `epic`, `fase-1` … `fase-4`, `priority:P0` … `priority:P2`, `meta`, `project`.

## Utility scripts

Executar a partir da raiz do repositório:

| Script | Função |
|--------|--------|
| `scripts/move-task.ps1` | `-Issue <N> -Status todo\|in_progress\|in_review\|done` |
| `scripts/add-task-to-project.ps1` | `-Issue <N>` — adiciona issue ao board |

Documentação humana do backlog: [docs/GITHUB_PROJECT.md](../../../docs/GITHUB_PROJECT.md).
