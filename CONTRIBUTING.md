# Contributing to squalr.us

It's a personal site, but it's run like a small product — versioned, with a [changelog](./CHANGELOG.md) and a [backlog](./BACKLOG.md). This doc covers setup, adding content, and shipping. For voice/style and architecture notes, see [CLAUDE.md](./CLAUDE.md).

## Setup

You only need **Hugo extended `0.162.1`** on your `PATH` (pinned in [.tool-versions](./.tool-versions)). The theme is plain CSS compiled through Hugo's asset pipeline — **no Sass, no Node, no build toolchain.**

- Install the *extended* Hugo build from [gohugo.io/installation](https://gohugo.io/installation/), or via `mise` / `asdf` from `.tool-versions`.

```bash
hugo serve            # localhost:1313
hugo serve -DF        # also include drafts (-D) and future-dated posts (-F)
hugo --minify         # production build — this is the correctness gate before a PR
```

If CSS ever looks stale after a change, clear Hugo's resource cache: delete `resources/_gen` and rebuild.

## Adding a blog post

```bash
hugo new ./blog/my-post-title.md
```

```yaml
---
title: "Post Title"
date: 2026-06-01T00:00:00+00:00
tags: [process, website]
projects: [squalr.us]   # optional — cross-links this post to a project
---
```

- **Images** go in `static/img/blog/my-post-title/`, referenced as `/img/blog/my-post-title/image.png`.
- **Scheduling.** A future `date` hides the post until that date passes *and* a build runs after it (Hugo's `buildFuture` is off by design). The site only rebuilds on push, so "publishing" a future-dated post today means pushing a commit on/after its date. Track drafts and scheduled posts in the [BACKLOG content queue](./BACKLOG.md#content-queue).
- **Voice.** Match the writing-style guide in [CLAUDE.md](./CLAUDE.md) — conversational, opinionated, short paragraphs, `## tldr;` on longer posts. Post bodies render in a readable Times serif inside the page's window, so long-form reads fine despite the garish chrome.

## Adding a project

Projects live in `content/projects/*.md`. Everything but `title` / `status` is optional:

```yaml
---
title: "Project Name"
slug: project-name           # optional; sets the URL (else derived from title)
status: active               # active | wip | paused | archived  → colored status pill
weight: 20                   # sort order in the grid (lower = first)
tech: [Rust, Tauri]          # rendered as tag pills
repo: https://…              # "github↗" link
links:                       # any extra labelled links
  - label: "Live ↗"
    url: https://…
image: /img/projects/<slug>/featured.png   # screenshot banner (card + detail hero)
gallery:
  - src: /img/projects/<slug>/shot.png
    caption: "What this shows"
terminal:                    # used ONLY when there is no image — renders a DOS banner
  label: 'project — ci'
  lines: ['$ run', '# a comment', '✓ done', '⚠ todo']
---
```

- **Banner logic:** `image` set → screenshot; otherwise an auto-generated DOS-terminal banner (override the lines with `terminal:`). No project card is ever a blank box.
- **Cross-linking:** a post with `projects: [<this project's filename base>]` shows a project chip and increments the card's `◇ field notes` count. The match key is the project's **filename** (e.g. `squalr.us`), not its title or slug.
- **Image drop-zones** already exist at `static/img/projects/<slug>/`.

## Configuring the homepage hero

The hero is data, not markup — edit `config.yaml › params.hero`:

```yaml
hero:
  kicker: '2026'
  lines: ['YEAR', 'OF {SHIPPING}.']   # the word in {braces} becomes the rainbow wordmark
  subtitle: 'Sr Consultant … {highlighted phrase}.'
  status: 'shipping'
  flavorChip: 'hotdogs/wk ∞'
```

The palette lives next to it in `params.style`.

## Shipping a change (versioning)

The site is versioned with [semver](https://semver.org/), and the version is **derived from the changelog** — there is no separate version constant. Full checklist: [BACKLOG.md → Shipping a backlog item](./BACKLOG.md#shipping-a-backlog-item). Short version:

1. Branch `vX.Y.Z` off `main`.
2. Move the entry to the top of [CHANGELOG.md](./CHANGELOG.md) — dated, classified (`Added` / `Changed` / `Fixed` / `Removed`). **Adding that block is the version bump** (the footer + `/changelog` read the latest version from the top of the file).
3. Update docs only where reality changed (`CLAUDE.md`, this file, `docs/TECH-STACK-AUDIT.md`).
4. Run `hugo --minify` — must exit clean.
5. Commit, push, open a PR. Review the Azure preview deployment, then merge to ship.

Semver: feature → minor, fix / improvement / cleanup → patch, breaking (URL structure, feeds, removing a page) → major.

## Deployment

`main` → GitHub Actions (pinned Hugo) → Azure Static Web Apps. PRs get a preview URL posted as a comment. There's no scheduled rebuild yet (it's in the backlog), so future-dated posts wait for the next push to `main`.
