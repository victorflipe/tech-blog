# Wiki do tech-blog

As páginas de **Fluxo de Trabalho** e **Padronização de Commits** (baseadas na [docawave-docs](https://github.com/Thiafa/docawave-docs/wiki)) ficam em:

- `docs/wiki/` — cópia versionada no repositório (leitura direta no GitHub)
- `tech-blog.wiki/` ou `challenge-gd.wiki/` — clone Git da [GitHub Wiki](https://docs.github.com/pt/communities/documenting-your-project-with-wikis/about-wikis) (publicação)

## Publicar na GitHub Wiki

1. No GitHub, abra **Settings → General → Features** e marque **Wikis**.
2. Clone ou atualize o remoto da wiki:

```powershell
git clone https://github.com/victorflipe/tech-blog.wiki.git
# ou, no clone existente:
cd challenge-gd.wiki
git remote set-url origin https://github.com/victorflipe/tech-blog.wiki.git
```

3. Publique:

```powershell
git push -u origin master
```

## Atualizar conteúdo

1. Edite os arquivos em `docs/wiki/` (fonte de verdade no monorepo).
2. Copie para o clone da wiki e faça commit:

```powershell
Copy-Item docs\wiki\*.md challenge-gd.wiki\ -Force
cd challenge-gd.wiki
git add -A
git commit -m "docs(wiki): atualizar paginas"
git push origin master
```

O `_Sidebar.md` da wiki Git vive no clone da wiki (ex.: `challenge-gd.wiki/_Sidebar.md`).
