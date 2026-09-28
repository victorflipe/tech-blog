# Fluxo de Trabalho — Git & GitHub

Este documento define o **padrão de trabalho com Git e GitHub** do repositório **tech-blog (TechBlog)**. É obrigatório para todos os colaboradores — humanos e agentes de IA.

Adotamos o **GitHub Flow (modificado)**: branches curtas a partir de `dev`, integração via Pull Request e promoção controlada para produção.

> Se a branch `dev` ainda não existir no remoto, crie-a a partir de `main` e passe a ramificar features a partir dela.

---

## Estratégia de Branching

| Branch | Papel | Ambiente | Recebe merge de |
|---|---|---|---|
| **`main`** | Produção. Sempre estável e deployável. | Produção | `dev` |
| **`dev`** | Staging / homologação. Integração das features. | Staging | feature/fix branches |

Fluxo de promoção do código:

```
feature/fix  →  dev (homologação)  →  main (produção)
```

> ⚠️ **Nunca** faça commit direto em `main` ou `dev`. Todo código entra via Pull Request.

### Nomenclatura de branches

Formato: `tipo/descricao-curta-em-kebab-case`. Opcional: incluir o ID da issue (`feature/12-leitura-de-artigo`).

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feature/` | Nova funcionalidade | `feature/leitura-de-artigo` |
| `fix/` | Correção de bug | `fix/403-na-edicao-de-artigo` |
| `hotfix/` | Correção urgente em produção (sai de `main`) | `hotfix/falha-no-login` |
| `refactor/` | Refatoração sem mudar comportamento | `refactor/article-service` |
| `chore/` | Manutenção, dependências, configuração | `chore/atualizar-dependencias` |
| `docs/` | Documentação | `docs/guia-de-deploy` |

---

## Commits

O projeto adota **Conventional Commits**. Formato resumido:

```
<tipo>[escopo opcional][!]?: <descrição no imperativo>
```

Exemplos:

```
feat(api): adicionar endpoint get article por id
fix(api): retornar 403 ao editar artigo de outro autor
refactor(frontend): extrair hook useArticle
docs(wiki): documentar fluxo de trabalho com git
```

> 📝 Regras completas, tipos aceitos e relação com SemVer na página **[Padronização de Commits](Padronização-de-Commits.md)**.

---

## Pull Requests e Code Review

Todo merge acontece via Pull Request. Requisitos para aprovar o merge:

- ✅ Checks de CI verdes (quando configurados)
- ✅ Sem conflitos com a branch de destino
- ✅ Comentários de review resolvidos
- ✅ Número mínimo de aprovações atingido (tabela abaixo)

Tarefas podem ser rastreadas via **GitHub Issues** e **GitHub Project** (ver `docs/GITHUB_PROJECT.md` no repositório).

### Regras de aprovação

| Pull Request (origem → destino) | Aprovações obrigatórias |
|---|---|
| `feature/fix` → `dev` (homologação) | **1** desenvolvedor |
| **`dev` → `main` (produção)** | **≥ 2** desenvolvedores |

> 🔒 Recomendado proteger `main` e `dev` com **Branch Protection Rules**: exigir Pull Request, exigir o número de aprovações acima e exigir os status checks antes do merge.

### Template de Pull Request

Preencha ao abrir um PR. Salve este modelo em `.github/pull_request_template.md` no repositório para que ele apareça automaticamente em todo novo PR.

```markdown
## Autor
Nome — @usuario-github

## Link da Task
<!-- GitHub Issue / Project -->
https://github.com/victorflipe/tech-blog/issues/...

## Resumo do que foi feito
<!-- Descrição sucinta das alterações ou novas funcionalidades -->
-

## Instruções de teste / Validação
<!-- Passos para validar. Remover se não se aplicar. -->
1.
2.

## Checklist
- [ ] Segue o padrão de Conventional Commits
- [ ] Testado localmente
- [ ] CI passando
```

---

## Resumo rápido

1. Crie a branch a partir de `dev`: `feature/nome-da-task`.
2. Faça commits no padrão **Conventional Commits**.
3. Abra o PR para **`dev`** → **1 aprovação** → merge (homologação).
4. Para produção, abra o PR de **`dev` → `main`** → **2 aprovações** → merge.
5. Nunca faça commit direto em `main` / `dev`.

---

## Referências

- [GitHub Flow](https://docs.github.com/pt/get-started/using-github/github-flow)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
- [Padronização de Commits](Padronização-de-Commits.md)
- [Docawave — Fluxo de Trabalho](https://github.com/Thiafa/docawave-docs/wiki/Fluxo-de-Trabalho-Git-e-GitHub) (referência original)
