[![Azure Static Web Apps CI/CD](https://github.com/squalrus/squalr.us/actions/workflows/azure-static-web-apps-blue-plant-0a72bd81e.yml/badge.svg)](https://github.com/squalrus/squalr.us/actions/workflows/azure-static-web-apps-blue-plant-0a72bd81e.yml)

# squalr.us

Personal blog and project showcase for **Chad Schulz** — a [Hugo](https://gohugo.io/) static site with a custom cyberpunk theme, hosted on Azure Static Web Apps.

🔗 **Live:** https://squalr.us/

## Stack

- **Hugo** `0.162.1` (extended) — static site generator, pinned via `.tool-versions`
- **Dart Sass** `1.100.0` — SCSS compilation through Hugo's asset pipeline (no npm, no `node_modules`)
- **Custom theme** (`themes/squalr/`) — arcade-cyberpunk; Press Start 2P / Space Grotesk / JetBrains Mono
- **Azure Static Web Apps** — hosting + CDN, deployed via GitHub Actions

## Quick start

```bash
hugo serve            # dev server at localhost:1313
hugo serve -DF        # include drafts (-D) and future-dated posts (-F)
hugo --minify         # production build → public/
```

Dart Sass must be on your `PATH` — Hugo's extended build ships libsass, not dartsass. Install steps are in [CONTRIBUTING.md](./CONTRIBUTING.md#setup).

## Layout

```
content/        # blog/ posts, projects/, and the changelog + backlog page stubs
themes/squalr/  # the custom theme — layouts, SCSS, data
config.yaml     # site config, palette (params.style), hero (params.hero)
CHANGELOG.md    # shipped changes — also drives the footer version chip
BACKLOG.md      # what's next + the scheduled-post content queue
CLAUDE.md       # working guidance for humans and AI tools
```

## How this repo runs

The site has a semver version, a public [changelog](https://squalr.us/changelog/), and a public [backlog](https://squalr.us/backlog/) — all rendered straight from the Markdown files at the repo root. The version chip in the footer is read from the top of `CHANGELOG.md` at build time, so it can't drift.

Adding a post or project, and the shipping/versioning process, are documented in **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## Deployment

Push to `main` → GitHub Actions builds with the pinned Hugo + Dart Sass and deploys to Azure Static Web Apps. PRs get a preview deployment (URL posted as a comment); review the preview, then merge to ship.
