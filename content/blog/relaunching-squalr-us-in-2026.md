---
title: "Relaunching squalr.us in 2026"
date: 2026-06-02T00:00:00+00:00
tags:
  - azure
  - process
  - website
  - workflow
projects:
  - squalr.us
---

My Google Analytics had been collecting zero data since July 2023.

I didn't know that until I actually looked. The site loaded fine, posts rendered, nothing was obviously broken. But under the hood: Universal Analytics had been sunset for almost three years, the GitHub Actions deploy workflow was pinned to a `v0.0.1-preview` tag from 2019, Hugo was running on whatever version Azure felt like installing that day, and the theme was a git submodule I hadn't touched since 2021.

This is the `v1.0.0` post — where the blog stopped being a thing I'd let rot and became something I actually maintain (until I don't again).

## tldr

- Migrated from defunct Universal Analytics to GA4
- Updated GitHub Actions from `v0.0.1-preview` to current stable versions
- Pinned Hugo `0.162.1` (local + CI) and moved the SCSS pipeline off the deprecated libsass onto Dart Sass
- Replaced the m10c theme submodule with an owned custom theme — then redesigned it
- Added a Projects section with screenshots, galleries, and project ↔ post cross-linking
- Gave the site a version number, a public [changelog](/changelog/), and a public [backlog](/backlog/)
- Fixed a few years of accumulated small issues

## The audit

I started with a simple goal: dust off the blog and start writing again. Before adding anything new I wanted to understand the actual state of the site.

**Google Analytics**: The config had `UA-XXXXXXX` — a Universal Analytics property. Google shut that down in July 2023. The fix was straightforward but the CSP in `staticwebapp.config.json` also needed updating. GA4 loads from `googletagmanager.com` instead of `google-analytics.com`, so the allowed domains and inline script SHA both changed.

**GitHub Actions**: The deploy workflow was using `Azure/static-web-apps-deploy@v0.0.1-preview` — a tag from the public preview in 2019. Also `actions/checkout@v2`, which runs on Node 16 (end of life). Neither would break immediately, but both are the kind of thing that stops working quietly one day.

**Hugo version**: Nowhere specified. The workflow let Azure's Oryx builder pick whatever version it wanted. Local and CI builds diverged silently, and there was no way to reproduce a specific build.

**Theme**: m10c as a git submodule. Fine to set up initially, but I was depending on an upstream repo for every production build with no pinned commit.

**Other**: Broken `<nft-card>` web components in the NFT post (the `embeddable-nfts` library is long abandoned), a Microsoft auth script in the base template that had no business being there, and a hardcoded `©2022` copyright year.

## What got fixed

**GA4**: Config updated to `services.googleAnalytics.id: G-XXXXXXXXXX`. CSP updated with the correct domains and a recomputed inline script SHA. Analytics are actually collecting data again!

**GitHub Actions**: `actions/checkout` bumped to `v4`, Azure SWA deploy action to `v1`. Added an explicit Hugo install step using `peaceiris/actions-hugo@v3` with a pinned version, plus a `.tool-versions` file for local parity.

**Dart Sass**: Pinning Hugo to `0.162.1` surfaced a pile of deprecation warnings — including `css.Sass`'s libsass transpiler, which Hugo is dropping. I migrated the SCSS pipeline to Dart Sass and pinned `1.100.0` locally via `.tool-versions` (CI installs the latest `sass-embedded` at build time). That flushed out a bug: the pipeline had lost its `ExecuteAsTemplate` step, so the theme's color variables weren't being substituted before Sass ran.

**Custom theme**: Ported all of m10c's SCSS and HTML templates into `themes/squalr/` — a directory I own and slimmed down the Feather icons, reducing the file from 53KB (400+ icons) to 2KB (nine icons I use). More on how that went below.

**Projects section**: Added `/projects/` with a card grid, detail pages, and cross-linking between posts and projects. A blog post can reference a project via frontmatter, and the project page lists related posts automatically.

**Miscellaneous**: Removed the NFT embeds, the MS auth script, the hardcoded copyright year (now dynamic), and dropped `opensea.io` and `unpkg.com` from the CSP.

## Building the custom theme

The m10c theme served this blog well for five years. But a git submodule you don't own starts to feel less like a convenience and more like a dependency you can't audit — and I was about to do things to this site that no off-the-shelf theme was going to sit still for.

### What a Hugo theme actually is

A theme is a directory under `themes/` with a specific structure:

```
themes/squalr/
├── assets/css/      # SCSS, compiled by Hugo's own pipeline
├── data/            # JSON data files (icons, etc.)
├── layouts/         # HTML templates
└── theme.toml       # Metadata
```

Something neat that comes with Hugo: the CSS pipeline runs through Hugo so you write SCSS, Hugo compiles and fingerprints it. No NPM, no webpack, no `node_modules`.

### Phase one: parity

The first goal was boring on purpose — a custom theme that looked _identical_ to the old one. I initialized the submodule to read the source, then ported each piece: `_base.scss` for reset and typography, component partials for the layout, post content, tags, pagination, and the 404. The templates were nearly a direct copy.

Parity is the right first move. It de-risks everything: if the new theme renders the existing site pixel-for-pixel, you _know_ the port is correct, and every change after that is a deliberate design decision instead of a porting bug you can't tell apart.

### Phase two: lean all the way in

Identical-looking lasted about a day. The whole reason to own the theme was to do something with it.

The site is an homage to GeoCities now. We've got marquees, "under construction" banners, WinAmp style music player, a guestbook, and project cards that show either a real screenshot or an auto-generated faux-terminal banner, both of which have a CRT overlay.

A few things I'd actually recommend stealing:

**Make the hero configurable.** I wasn't sure about the HERO  copy, so I didn't hard-code it. Some of ehe hero copy comes from `config.yaml`:

```yaml
hero:
  kicker: 'HOME OF'
  lines:
    - '{SQUALRUS}'
```

A tiny bit of template logic turns `{SQUALRUS}` into the glowing `<span>` with the trailing `!!!`. Changing the headline is a one-line config edit, not a template dig.

**Generate a banner so no card is ever empty.** Projects without a screenshot render a fake terminal built from their own metadata — a `$` command, a comment line, a status line — instead of a blank rectangle. It's driven by an optional `terminal:` frontmatter block with a sensible auto-fallback.

**Cross-link posts and projects off one field.** A post names a project in frontmatter; the project page finds its related posts in reverse. Both directions read the same `projects` array — no relationship table to maintain:

```html
{{ $slug := .File.ContentBaseName }}
{{ $related := where site.RegularPages "Params.projects" "intersect" (slice $slug) }}
```

### The gotchas (there are always gotchas)

**The SCSS-as-template thing.** Early in the port I tried injecting config colors into SCSS variables via `resources.ExecuteAsTemplate` — running the `.scss` file through Hugo's templating engine before compiling. At one point the pipeline lost that step and the color variables stopped substituting; a stale build cache kept rendering the _old_ compiled CSS, so everything looked correct until I cleared the cache. Lesson: when CSS goes weird, nuke `resources/_gen` before you trust what you're seeing. I eventually dropped the approach and hardcoded the palette in `_vars.scss` instead.

**Modernizing and GeoCities-izing.** At the same time that I was modernizing the site's architecture, I was redesigning it with a early 2000s theme, it felt weird. Making it _work_ correctly, and _look_ incorrect can be mutually exclusive. It was fun working through the retro aesthetics and thinking up ways to blend the old with the new -- like the WinAmp UI pulling in Last.fm stats of my actual listening.

![Screenshot of the squalr.us homepage](/img/blog/relaunching-squalr-us-in-2026/screenshot.png)

## A version, a changelog, and a backlog

The part I'm most into isn't visual. The site now has a **version number** — real semver — rendered as a chip in the footer. It's read straight off the top of `CHANGELOG.md` at build time, so it can't drift.

And both the [changelog](/changelog/) and the [backlog](/backlog/) are published right here, rendered from the same Markdown files I actually work from. The roadmap is the literal file, warts and all, that I work from.

## Everything visible changed

The first pass of this work was the boring-but-important kind — reproducible builds, owned theme, analytics that actually collect.

It is not the summary now. The site looks nothing like it did in 2021, more like what it would have looked like in 2001. It tells you the version it's on, and it shows its own roadmap. There's potential to keep evolving instead of quietly rotting for another three years.

More posts coming!
