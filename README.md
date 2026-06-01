[![Azure Static Web Apps CI/CD](https://github.com/squalrus/squalr.us/actions/workflows/azure-static-web-apps-blue-plant-0a72bd81e.yml/badge.svg)](https://github.com/squalrus/squalr.us/actions/workflows/azure-static-web-apps-blue-plant-0a72bd81e.yml)

# squalr.us

Personal blog and project showcase for **Chad Schulz** — a [Hugo](https://gohugo.io/) static site with a custom **90s GeoCities** theme ("Cyber-Shack"), hosted on Azure Static Web Apps.

🔗 **Live:** https://squalr.us/

## Stack

- **Hugo** `0.162.1` (extended) — static site generator, pinned via `.tool-versions`
- **Plain CSS** through Hugo's asset pipeline (`resources.Get | minify | fingerprint`) — no npm, no Sass, no `node_modules`
- **Custom theme** (`themes/squalr/`) — light Web 1.0 / GeoCities; Press Start 2P / VT323 / Comic Neue, with Times-serif body text for readability
- A little client-side JS (`/cybershack.js`) for the visitor counter, guestbook, and cursor trail — `localStorage`, static-host-friendly
- **Azure Static Web Apps** — hosting + CDN, deployed via GitHub Actions

## Quick start

```bash
hugo serve            # dev server at localhost:1313
hugo serve -DF        # include drafts (-D) and future-dated posts (-F)
hugo --minify         # production build → public/
```

That's it — no Sass toolchain, no Node. If CSS ever looks stale after a change, clear Hugo's cache: delete `resources/_gen` and rebuild.

## Layout

```
content/         # blog/ posts, projects/, and the changelog + backlog page stubs
themes/squalr/
  layouts/index.html         # standalone 90s "Cyber-Shack" homepage
  layouts/_default/baseof.html  # 90s chrome for every inner page
  assets/css/cybershack.css  # the entire stylesheet (plain CSS)
  static/cybershack.js       # visitor counter, guestbook, sparkle cursor
config.yaml      # site config, palette (params.style), hero (params.hero)
CHANGELOG.md     # shipped changes — also drives the footer version chip
BACKLOG.md       # what's next + the scheduled-post content queue
CLAUDE.md        # working guidance for humans and AI tools
```

## How this repo runs

The site has a semver version, a public [changelog](https://squalr.us/changelog/), and a public [backlog](https://squalr.us/backlog/) — all rendered straight from the Markdown files at the repo root. The version chip in the footer is read from the top of `CHANGELOG.md` at build time, so it can't drift.

Adding a post or project, and the shipping/versioning process, are documented in **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

## Deployment

Push to `main` → GitHub Actions builds with the pinned Hugo and deploys to Azure Static Web Apps. PRs get a preview deployment (URL posted as a comment); review the preview, then merge to ship.
