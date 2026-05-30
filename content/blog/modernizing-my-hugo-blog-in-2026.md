---
title: "Modernizing My Hugo Blog in 2026"
date: 2026-05-30T00:00:00+00:00
tags:
  - azure
  - process
  - website
---

My Google Analytics had been collecting zero data since July 2023.

I didn't know that until I actually looked. The site loaded fine, posts rendered, nothing was obviously broken. But under the hood: Universal Analytics had been sunset for almost three years, the GitHub Actions deploy workflow was pinned to a `v0.0.1-preview` tag from 2019, Hugo was running on whatever version Azure felt like installing that day, and the theme was a git submodule I hadn't touched since 2021.

## tldr;

- Migrated from defunct Universal Analytics to GA4
- Updated GitHub Actions from `v0.0.1-preview` to current stable versions
- Pinned Hugo to a specific version
- Replaced the m10c theme submodule with an owned custom theme
- Added a Projects section
- Fixed a few years of accumulated small issues

## The audit

I started with a simple goal: dust off the blog and start writing again. Before adding anything new I wanted to understand the actual state of the site.

**Google Analytics**: The config had `UA-XXXXXXX` — a Universal Analytics property. Google shut that down in July 2023. The fix was straightforward (swap in a GA4 measurement ID and update the config format), but the CSP in `staticwebapp.config.json` also needed updating. GA4 loads from `googletagmanager.com` instead of `google-analytics.com`, so the allowed domains and inline script SHA both changed.

**GitHub Actions**: The deploy workflow was using `Azure/static-web-apps-deploy@v0.0.1-preview` — a tag from the public preview in 2019. Also `actions/checkout@v2`, which runs on Node 16 (end of life). Neither would break immediately, but both are the kind of thing that stops working quietly one day.

**Hugo version**: Nowhere specified. The workflow let Azure's Oryx builder pick whatever version it wanted. Local and CI builds could diverge silently, and there was no way to reproduce a specific build.

**Theme**: m10c as a git submodule. Fine to set up initially, but I was depending on an upstream repo for every production build with no pinned commit.

**Other**: Broken `<nft-card>` web components in the NFT post (the `embeddable-nfts` library is long abandoned), a Microsoft auth script in the base template that had no business being there, and a hardcoded `©2022` copyright year.

## What got fixed

**GA4**: Config updated to `services.googleAnalytics.id: G-XXXXXXXXXX`. CSP updated with the correct domains and a recomputed inline script SHA. Analytics are actually collecting data again.

**GitHub Actions**: `actions/checkout` bumped to `v4`, Azure SWA deploy action to `v1`. Added an explicit Hugo install step using `peaceiris/actions-hugo@v3` with a pinned version. Added `.tool-versions` for local parity.

**Custom theme**: Ported all of m10c's SCSS and HTML templates into `themes/squalr/` — a directory I own. Same layout, color palette, and components. One side effect: the Feather icons data file went from 53KB (400+ icons) to 2KB (nine icons actually in use).

**Projects section**: Added `/projects/` with a card grid, detail pages, and cross-linking between posts and projects. A blog post can reference a project via frontmatter, and the project page lists related posts automatically.

**Miscellaneous**: Removed the NFT embeds, the MS auth script, hardcoded copyright year (now dynamic), and dropped `opensea.io` and `unpkg.com` from the CSP.

## Nothing visible changed

Same layout, same posts, same URLs. The changes are all in the build pipeline, the ownership of the theme, and the analytics. But the site's in a better position to evolve — builds are reproducible, the theme is mine to modify, and adding a project is just a Markdown file.

More posts coming.
