# Padronização de Commits

Este documento define como o repositório **tech-blog (TechBlog)** escreve mensagens de commit e como elas se relacionam com o **Semantic Versioning (SemVer)**.

O projeto adota **[Conventional Commits](https://www.conventionalcommits.org/)**. Esse padrão deixa o histórico legível, facilita o changelog e determina de forma automática se a próxima versão é `MAJOR`, `MINOR` ou `PATCH`.

---

## Semantic Versioning (SemVer)

A versão do projeto segue `MAJOR.MINOR.PATCH` ([semver.org](https://semver.org/lang/pt-BR/)):

| Parte | Quando sobe | Exemplo |
|---|---|---|
| **MAJOR** (`X.0.0`) | Mudança incompatível (quebra contrato, API, fluxo ou dado existente) | `1.4.2` → `2.0.0` |
| **MINOR** (`x.Y.0`) | Nova funcionalidade compatível | `1.4.2` → `1.5.0` |
| **PATCH** (`x.y.Z`) | Correção de bug ou ajuste interno, sem mudar o comportamento público | `1.4.2` → `1.4.3` |

A mensagem do commit é o sinal de qual parte da versão deve subir.

---

## Formato da mensagem

```
<tipo>[escopo opcional][!]?: <descrição>

[corpo opcional]

[rodapé opcional]
```

Regras da primeira linha:

- Usar os **tipos em inglês** (`feat`, `fix`, `docs`, …)
- Descrição em **português**, no **imperativo** e em **minúsculas** (sem ponto final)
- Máximo de **72 caracteres** na primeira linha
- Não misturar assuntos: um commit, uma intenção

Exemplos válidos:

```
feat(api): adicionar get article por id
fix(api): corrigir autorizacao no put de artigo
docs(wiki): explicar padrao de commits
```

---

## Tipos de commit e impacto no SemVer

| Tipo | Uso | Impacto na versão |
|---|---|---|
| `feat` | Nova funcionalidade visível para o usuário | **MINOR** |
| `fix` | Correção de bug | **PATCH** |
| `perf` | Melhoria de desempenho sem mudar o contrato | **PATCH** |
| `refactor` | Reorganização de código sem mudar comportamento | — (não publica versão sozinho) |
| `docs` | Documentação, Wiki, README | — |
| `style` | Formatação, lint, espaços (sem lógica) | — |
| `test` | Inclusão ou ajuste de testes | — |
| `chore` | Tarefas de manutenção (deps, scripts, CI simples) | — |
| `build` | Build, empacotamento, bundler | — |
| `ci` | Pipeline e automação de CI/CD | — |
| `revert` | Reverte um commit anterior | **PATCH** (em geral) |

O `!` depois do tipo/escopo, ou o rodapé `BREAKING CHANGE:`, marca **quebra de compatibilidade** e sobe o **MAJOR**, independentemente do tipo:

```
feat(api)!: remover campo legado no payload de artigo

BREAKING CHANGE: o campo `status` deixa de ser aceito no payload.
Clientes devem usar `published`.
```

---

## Escopo

O escopo (opcional) indica a área alterada. Use nomes curtos e estáveis, por exemplo:

- `api`, `frontend`, `auth`, `docs`, `wiki`, `ci`, `deps`, `docker`

```
fix(frontend): corrigir link da lista para rota de leitura
chore(deps): atualizar dependencias do backend
```

---

## Corpo e rodapé

Use o corpo quando a primeira linha não explica o *porquê*. O rodapé serve para referências e breaking changes.

```
fix(api): ignorar artigos inexistentes na busca por tag

Artigos removidos do seed ainda apareciam no filtro
quando a tag permanecia na tabela associativa.

Closes #12
```

Rodapés úteis:

- `BREAKING CHANGE: <o que quebrou e como migrar>`
- `Closes #123` / `Fixes #123` / `Refs #123`

---

## Relação commit → versão

Na hora de publicar:

1. Existem commits `feat` desde a última tag? → `MINOR`
2. Só `fix` / `perf` / `revert`? → `PATCH`
3. Há `BREAKING CHANGE` ou `tipo!:`? → `MAJOR` (tem prioridade)

Exemplos a partir de `1.3.0`:

| Commits desde a última release | Próxima versão |
|---|---|
| `fix: corrigir validacao de email` | `1.3.1` |
| `feat: exportar relatorio em csv` | `1.4.0` |
| `feat!: trocar autenticacao para oauth` | `2.0.0` |

---

## Exemplos do projeto

**Bom**

```
feat(api): adicionar endpoint get article por id
fix(frontend): enviar bearer token nas requisicoes autenticadas
docs: atualizar readme com smoke tests
chore(docker): adicionar healthcheck do postgres
```

**Evitar**

```
update
ajustes
WIP
feat: varias coisas (api, frontend e docker)
Fix Timeout
```

---

## Boas práticas

- Commits pequenos e revisáveis; não misture `feat` e `fix` no mesmo commit
- Não commitar segredos, tokens ou arquivos de ambiente (ex.: `backend/.env`)
- Preferir `feat` / `fix` para o que entra no changelog; use `chore` / `docs` para o resto
- Se o PR resolve uma issue, referencie no rodapé (`Closes #4`)
- Antes do push, releia a primeira linha: ela deve fazer sentido sozinha no `git log`

---

## Referências

- [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Docawave — Padronização de Commits](https://github.com/Thiafa/docawave-docs/wiki/Padronização-de-Commits) (referência original)
