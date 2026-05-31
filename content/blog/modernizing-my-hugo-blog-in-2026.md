---
title: "Modernizing My Hugo Blog in 2026"
date: 2026-06-04T00:00:00+00:00
tags:
  - azure
  - process
  - website
projects:
  - squalr.us
---

My Google Analytics had been collecting zero data since July 2023.

I didn't know that until I actually looked. The site loaded fine, posts rendered, nothing was obviously broken. But under the hood: Universal Analytics had been sunset for almost three years, the GitHub Actions deploy workflow was pinned to a `v0.0.1-preview` tag from 2019, Hugo was running on whatever version Azure felt like installing that day, and the theme was a git submodule I hadn't touched since 2021.

This is the `v1.0.0` post — where the blog stopped being a thing I'd let rot and became something I actually maintain.

## tldr

- Migrated from defunct Universal Analytics to GA4
- Updated GitHub Actions from `v0.0.1-preview` to current stable versions
- Pinned Hugo `0.162.1` (local + CI) and moved the SCSS pipeline off the deprecated libsass onto Dart Sass
- Replaced the m10c theme submodule with an owned custom theme — then redesigned it into a cyberpunk arcade thing
- Added a Projects section with screenshots, galleries, and project ↔ post cross-linking
- Gave the site a version number, a public [changelog](/changelog/), and a public [backlog](/backlog/)
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

**GitHub Actions**: `actions/checkout` bumped to `v4`, Azure SWA deploy action to `v1`. Added an explicit Hugo install step using `peaceiris/actions-hugo@v3` with a pinned version, plus a `.tool-versions` file for local parity.

**Dart Sass**: Pinning Hugo to `0.162.1` surfaced a pile of deprecation warnings — including `css.Sass`'s libsass transpiler, which Hugo is dropping. I migrated the SCSS pipeline to Dart Sass `1.100.0` (pinned the same version locally and in CI). That flushed out a buried bug, too: the pipeline had quietly lost its `ExecuteAsTemplate` step, so the theme's color variables weren't being substituted before Sass ran — a stale build cache was the only reason it looked fine.

**Custom theme**: Ported all of m10c's SCSS and HTML templates into `themes/squalr/` — a directory I own. One side effect: the Feather icons data file went from 53KB (400+ icons) to 2KB (nine icons actually in use). I wrote up that port [in its own post](/2026/06/building-a-custom-hugo-theme/).

**Projects section**: Added `/projects/` with a card grid, detail pages, and cross-linking between posts and projects. A blog post can reference a project via frontmatter, and the project page lists related posts automatically — the little `◇ N field notes` links you'll see on the project cards.

**Miscellaneous**: Removed the NFT embeds, the MS auth script, the hardcoded copyright year (now dynamic), and dropped `opensea.io` and `unpkg.com` from the CSP.

## Then I redesigned the whole thing

The "owned, modernized, identical-looking" theme lasted about a day before I decided identical-looking wasn't the point.

The site now leans all the way into cyberpunk: an arcade-pixel hero in [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) with a neon flicker on the lit word, a textured background (dot grid, horizon glow, CRT scanlines, vignette), and project cards that either show a real screenshot or an auto-generated faux-terminal banner so no card is ever a blank box. Teal and cyan neon on a near-black blue, with ember orange for the fun punctuation.

A couple of decisions I'm happy with:

- **The hero heading is config, not markup.** I'm still not sold on "MY YEAR OF SHIPPING.", so the kicker, the heading lines, the lit neon word, and the subtitle all live in `config.yaml`. Wrap a word in `{braces}` and it becomes the glowing one. Changing it is a one-line edit, not a template dig.
- **Image-less projects get a terminal.** `merge-bot` and `desktop-tracker` don't have screenshots, so they render a little fake CI/dev terminal generated from their metadata instead of an empty rectangle.

It's louder than the old site by a wide margin. That's the idea.

## A version, a changelog, and a backlog

The part I'm most into isn't visual. The site now has a **version number** — real semver — rendered as a chip in the footer. It's read straight off the top of `CHANGELOG.md` at build time, so it can't drift.

And both the [changelog](/changelog/) and the [backlog](/backlog/) are published right here, rendered from the same Markdown files I actually work from. The roadmap isn't a marketing page; it's the literal file, open questions and all. That whole workflow — a backlog, a changelog, and a `CLAUDE.md` doing the heavy lifting — is enough of a thing that it gets [its own post](/2026/06/the-three-markdown-files-that-replaced-my-project-tools/).

## Everything visible changed

The first pass of this work was the boring-but-important kind — reproducible builds, owned theme, analytics that actually collect. "Nothing visible changed" was the honest summary back then.

It is not the summary now. The site looks nothing like it did in 2021, it tells you what version it's on, and it shows its own roadmap. More to the point: it's in a position to keep evolving instead of quietly rotting for another three years.

More posts coming. They're already queued.
