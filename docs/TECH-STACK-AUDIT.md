# Tech Stack Audit — squalr.us

_Audit date: 2026-05-30_

> **Status: largely superseded (2026-06).** This is the audit of the *starting* state. Most findings are now resolved — GA4 is live, Hugo is pinned (`0.162.1`), the GitHub Actions are current, and the m10c submodule was replaced by an owned custom theme (now a 90s GeoCities design — plain CSS, no Sass). Kept as a historical record of where the cleanup began. Active tech debt now lives in [BACKLOG.md](../BACKLOG.md); shipped changes in [CHANGELOG.md](../CHANGELOG.md).

## Overview

squalr.us is a Hugo-based personal blog hosted on Azure Static Web Apps and deployed via GitHub Actions. The core architecture is sound — static generation, CDN delivery, and minimal dependencies are all good choices for a personal blog. Most issues are maintenance debt from ~2–3 years of dormancy rather than structural problems.

---

## Current Stack

| Layer | Technology | Notes |
|---|---|---|
| Generator | Hugo | Version unpinned |
| Theme | m10c (git submodule) | `github.com/vaga/hugo-theme-m10c` |
| Hosting | Azure Static Web Apps | Free tier |
| CDN | Azure CDN Premium Verizon | Via ASWA |
| CI/CD | GitHub Actions | Two workflows |
| Analytics | Google Analytics (UA) | **Defunct — see below** |
| CSS | Hugo SCSS pipeline | Fingerprinted for cache busting |
| Formatting | Prettier | `.prettierrc` configured |

---

## Critical Issues

### 1. Google Analytics Universal Analytics is dead

The config.yaml references `UA-10469485-9`. Google shut down Universal Analytics in July 2023. This property has not collected any data since then.

**Fix:** Create a GA4 property, replace `googleAnalytics: UA-10469485-9` in `config.yaml` with the new `G-XXXXXXXXXX` measurement ID. Hugo's built-in `google_analytics` template supports GA4.

Also update the CSP `script-src` in `staticwebapp.config.json` — GA4 loads from `https://www.googletagmanager.com` instead of `https://www.google-analytics.com`.

---

### 2. GitHub Actions workflows are severely outdated

**`azure-static-web-apps-blue-plant-0a72bd81e.yml`:**

- `actions/checkout@v2` → current is **v4** (v2 is deprecated and uses Node 16, which is EOL)
- `Azure/static-web-apps-deploy@v0.0.1-preview` → current is **v1** (preview tag has been archived; this may stop working without notice)
- No Hugo version pinned — the build relies on whatever Hugo version ASWA injects, which can change silently

**`merge-bot.yml`:**

- `squalrus/merge-bot@master` — pinning to `@master` means updates to that action take effect immediately without review. Pin to a specific release tag or SHA.

**Fix (deploy workflow):**
```yaml
- uses: actions/checkout@v4
  with:
    submodules: true
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v3
  with:
    hugo-version: '0.147.1'  # pin to latest stable
    extended: true
- name: Build
  run: hugo --minify
- name: Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    ...
    skip_app_build: true
    app_artifact_location: "public"
```

---

## Important Issues

### 3. Hugo version is completely unpinned

No `.tool-versions`, `mise.toml`, or README entry specifies which Hugo version to use locally. If the build environment auto-upgrades Hugo, breaking changes could silently break the site. Local builds may differ from CI builds.

**Fix:** Pick a Hugo version, add it to:
- A `mise.toml` or `.tool-versions` file for local dev
- The CI workflow (see above)
- The README

---

### 4. m10c theme submodule is a fragile dependency

The theme is pulled in as a git submodule (no pinned commit SHA). Upstream changes to the theme apply automatically on fresh clones. The m10c theme repo is also minimally maintained — last meaningful update was years ago.

Since the plan is to build a custom theme anyway (see `THEME-PLAN.md`), this resolves itself. In the meantime, pin the submodule to a specific commit so upstream surprises don't break the build.

**Fix (short-term):**
```bash
cd themes/m10c
git checkout <current-commit-sha>
cd ../..
git add themes/m10c
git commit -m "Pin m10c submodule to specific commit"
```

---

### 5. Copyright year is hardcoded

`config.yaml` has `copyright: '©2022 Chad Schulz'`. It's now 2026.

**Fix:** Use Hugo's `now.Year` to make it dynamic in the theme's footer template:
```html
© {{ now.Format "2006" }} Chad Schulz
```

Or just update the year in `config.yaml` until the custom theme is built.

---

### 6. NFT post embeds are broken

The "WTF is NFT" post uses `<nft-card>` web components loaded from `https://unpkg.com/embeddable-nfts/dist/nft-card.min.js`. The `embeddable-nfts` package is unmaintained and OpenSea has changed their API. These cards almost certainly render as empty elements.

The OpenSea URLs referenced in the CSP (`https://api.opensea.io`) and the script itself are likely returning errors. The post content remains valuable — the embedded cards are decorative.

**Fix options:**
- Replace the NFT card embeds with static screenshots
- Remove the web component entirely and link directly to OpenSea
- Add a note to the post acknowledging the embeds are defunct

---

## Minor Issues

### 7. Microsoft auth script in base template

`layouts/_default/baseof.html` loads a Microsoft-internal `meversion` auth script. This is carry-over from work tooling and has no function on a personal blog. It's dead weight and a potential CSP violation surface.

**Fix:** Remove the `<script>` block loading `meversion` from `baseof.html`.

---

### 8. Twitter social link / X rebranding

`config.yaml` references `https://twitter.com/chadschulz`. Twitter is now X but the old domain still redirects. Low urgency, but worth updating if/when rebuilding the theme.

---

### 9. Hardcoded Prettier tab width

`.prettierrc` is configured. Fine for formatting consistency, but worth noting that it should be committed and the pre-commit enforcement is informal (no husky or lint-staged). Contributors could bypass it.

---

### 10. CSP includes OpenSea

`staticwebapp.config.json` CSP allows `https://api.opensea.io` for the NFT embeds. Once those embeds are removed or replaced, the OpenSea CSP entry can be dropped.

---

## What's Working Well

- **Azure Static Web Apps** — right-sized for a personal blog, free tier, PR preview deployments are a nice touch
- **Hugo SCSS pipeline with fingerprinting** — proper cache busting without a frontend build tool (npm/webpack)
- **CSP + security headers** — the content security policy is well-thought-out; A+ security score is worth maintaining
- **Cache headers** — 6-month cache for images, 1-week for everything else via `staticwebapp.config.json`
- **Merge bot + PR previews** — automated label-based merge with staging environments is a solid workflow for a solo blog
- **No npm / no node_modules** — zero frontend build dependencies makes the project trivially easy to set up locally
- **Responsive layout** — single-breakpoint sidebar is simple and works

---

## Recommended Action Order

1. **Now:** Migrate to GA4 — you've had zero analytics since July 2023
2. **Now:** Update GitHub Actions (`checkout@v4`, `static-web-apps-deploy@v1`)
3. **Soon:** Pin Hugo version in CI and add a `.tool-versions` file
4. **Soon:** Fix the NFT post embeds (screenshots or removal)
5. **Soon:** Remove the Microsoft auth script from `baseof.html`
6. **With theme work:** Move away from m10c submodule, dynamic copyright year, drop OpenSea from CSP
