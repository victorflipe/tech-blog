# Telas da aplicação

Capturas do frontend editorial do TechBlog (`http://localhost:5173`), usadas como referência visual da UI. Arquivos em [`docs/screenshots/`](../screenshots/).

Leitura de artigos, feed e tags é **pública**. Escrever, editar, excluir e comentar exigem login.

## Mapa de rotas

| Tela | Rota | Acesso |
|---|---|---|
| Home | `/` | Público |
| Login | `/login` | Público |
| Cadastro | `/login/register` | Público |
| Feed | `/articles` | Público (ações de autor se autenticado) |
| Leitura | `/articles/:id` | Público (comentários se autenticado) |
| Novo artigo | `/articles/new` | Autenticado |
| Editar artigo | `/articles/:id/edit` | Autenticado (autor) |
| 404 | qualquer rota inexistente | Público |

---

## Home

Landing editorial em tela cheia, abaixo do header de 72px.

![Home](../screenshots/01-home.png)

## Login

Entrada da área autenticada. Credenciais seed: `{primeiro}{segundo}@teste.com` / `teste` (ex.: `fredmarques@teste.com`).

![Login](../screenshots/02-login.png)

## Cadastro

Criação de conta. Após sucesso, redireciona para o login.

![Cadastro](../screenshots/03-register.png)

## Feed (visitante)

Lista pública com busca (mín. 2 caracteres), tags e paginação. Sem botões de editar/excluir.

![Feed público](../screenshots/04-feed.png)

## Leitura (visitante)

Coluna de leitura ~680px. Visitante vê o artigo e o convite para entrar e comentar.

![Leitura pública](../screenshots/05-reader.png)

## Página não encontrada

![404](../screenshots/06-not-found.png)

## Feed (autenticado)

Header com **Escrever** / **Sair**. Artigos do autor atual mostram **Editar** e **Excluir**.

![Feed autenticado](../screenshots/07-feed-autenticado.png)

## Novo artigo

Editor Markdown com tags, URL de imagem e preview.

![Editor](../screenshots/08-editor.png)

## Editar artigo

Mesmo formulário, pré-preenchido. Disponível só para o autor.

![Editar artigo](../screenshots/09-editor-editar.png)

## Leitura (autenticado)

Autor vê **Editar** / **Excluir**. Qualquer usuário logado vê o campo de comentário.

![Leitura autenticada](../screenshots/10-reader-autenticado.png)
