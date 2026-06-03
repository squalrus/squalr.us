# CLAUDE.md — squalr.us

Personal blog + project showcase for Chad Schulz. Hugo static site with a custom **90s GeoCities** theme ("Cyber-Shack"), hosted on Azure Static Web Apps.

## Common Commands

```bash
# Local development
hugo serve                          # dev server at localhost:1313
hugo serve -D                       # include draft posts
hugo new ./blog/{post-name}.md      # create a new post from archetype
hugo --minify                       # production build → public/
```

No npm, no node_modules. The theme stylesheet is **SCSS** compiled through Hugo's asset pipeline (`resources.Get "css/cybershack.scss" | toCSS | minify | fingerprint`). **Dart Sass must be on `PATH`** — `hugo --minify` fails if it isn't. Install the embedded binary (not the pure-JS `sass` package): `npm install -g sass-embedded`.

## Project Structure

```
content/
  blog/            # posts (.md); a future date = scheduled (hidden until a build runs after it)
  projects/        # project pages (.md)
  changelog.md     # thin stub → renders root CHANGELOG.md via the doc layout
  backlog.md       # thin stub → renders root BACKLOG.md via the doc layout
themes/squalr/
  layouts/
    index.html               # standalone 90s "Cyber-Shack" homepage (does NOT use baseof)
    _default/baseof.html      # 90s chrome for every inner page (marquee, Win95 window, footer)
    partials/                 # pcard, post-li, cybershack-terminal, related-projects, icon
  assets/css/cybershack.scss  # SCSS entry point — @use imports all partials
  assets/css/_vars.scss       # CSS custom properties (:root)
  assets/css/_fonts.scss      # @font-face declarations
  assets/css/_base.scss       # reset, body, cursor, links
  assets/css/_animations.scss # blink, rainbow, marquee + @keyframes
  assets/css/_a11y.scss       # skip-link, sr-only, focus ring
  assets/css/_win95.scss      # .win window chrome
  assets/css/_layout.scss     # .page, .cols
  assets/css/_banner.scss     # .banner-top, .banner-inner, construction badge
  assets/css/_nav.scss        # .navrow
  assets/css/_sidebar.scss    # panel, counter, statlist, badges, social icons
  assets/css/_winamp.scss     # WinAmp now-playing widget
  assets/css/_homepage.scss   # .welcome, hr.candy, .sticker, .projgrid
  assets/css/_projects.scss   # .pcard, .shot, .termshot, CRT effect
  assets/css/_posts.scss      # .posts list, .newgif
  assets/css/_guestbook.scss  # .gb-form, .gb-entry
  assets/css/_footer.scss     # .foot, .spark cursor
  assets/css/_inner.scss      # inner-page chrome (.page-title, .post-header, .error-404)
  assets/css/_prose.scss      # .post-content, .doc-content, related sections, changelog
  assets/css/_tags.scss       # a.tag, .tags-list
  assets/css/_project-detail.scss # project detail meta, hero image, gallery
  assets/css/_pagination.scss # .pagination
  assets/css/_responsive.scss # prefers-reduced-motion + max-width:760px
  static/cybershack.js        # visitor counter, guestbook, sparkle cursor, now-playing (localStorage)
assets/
  img/projects/    # project featured images (processed by Hugo → WebP srcset at build time)
static/
  img/             # blog post images and any other static assets
  staticwebapp.config.json    # cache + CSP / security headers for Azure
config.yaml        # site config, menu, palette (params.style), hero (params.hero)
```

The homepage is standalone; every other page renders through `baseof.html`, which wraps the page's content in a Win95 "window" with a cream, **readable** body (Times-serif prose for posts/projects).

## Adding a New Post

1. `hugo new ./blog/my-post-title.md`
2. Edit the generated file in `content/blog/`
3. Set `draft: false` (or remove the draft line) when ready to publish
4. Put images in `static/img/blog/my-post-title/`
5. Reference images as `/img/blog/my-post-title/image.png`

Frontmatter format:

```yaml
---
title: "Post Title Here"
date: 2026-05-30T00:00:00+00:00
tags:
  - tag-one
  - tag-two
---
```

### Canonical tag vocabulary

Use only these tags on new posts. Do not invent new ones without updating this list.

| Tag | Use for |
| --- | --- |
| `azure` | Azure services, cloud hosting, Azure Static Web Apps, Azure Storage |
| `website` | Web development, static sites, HTML/CSS/JS, site architecture |
| `process` | Engineering process, estimation, prioritization, team dynamics |
| `workflow` | Developer workflow, CI/CD pipelines, tooling, automation |
| `automation` | GitHub Actions, CI/CD automation, scripted pipelines |
| `documentation` | Documentation practices, specs, READMEs, changelogs |
| `ai` | AI, LLMs, Claude, prompt engineering |
| `web3` | NFT, cryptocurrency, blockchain |

## Adding a Project

Projects live in `content/projects/*.md` and render via `themes/squalr/layouts/projects/`.

Supported frontmatter:

```yaml
---
title: "Project Name"
date: 2026-06-01T00:00:00+00:00   # ISO 8601; used for sorting, not displayed
description: "One-sentence plain-English summary shown on the project card."
status: active          # active | wip | paused | archived (colored status pill)
weight: 10              # sort order (lower = first)
tech: [TypeScript, Go]  # shown as tags
repo: https://...       # optional; renders "GitHub ↗"
demo: https://...       # optional; renders "Demo ↗"
links:                  # optional; arbitrary labelled links
  - label: "Live ↗"
    url: "https://..."
# image: /img/projects/<slug>/featured.png   # featured pic (card + detail header)
                                              # source file lives in assets/img/projects/<slug>/featured.png
                                              # (Hugo resizes to WebP srcset at build time; ≤1366px wide source recommended)
# gallery:                                    # drill-in gallery on the detail page
#   - src: /img/projects/<slug>/shot.png      # gallery images still served from static/img/projects/<slug>/
#     caption: "What this shows"
# terminal:                                   # image-less cards render a DOS banner from this
#   label: 'merge-bot — ci'
#   lines: ['$ merge-bot --auto', '# labels ok', '✓ merged PR #482']
---
```

**Featured image** (`image:`) — put the source file in `assets/img/projects/<slug>/featured.png` (≤1366px wide). Hugo resizes it to WebP at build time and generates a srcset; no manual resizing needed. The `image:` frontmatter value stays as the URL path `/img/projects/<slug>/featured.png` — the template strips the leading `/` to find the asset.

**Gallery images** (`gallery[].src`) — still go in `static/img/projects/<slug>/` (served as-is; Hugo doesn't process them).

All of `image`, `gallery`, and `terminal` are optional. Card banner logic: `image` → screenshot; else the `terminal:` block (or an auto-generated one) renders a DOS-style banner so no card is ever blank. A post with `projects: [<this project's filename base>]` shows a `◇ field notes` cross-link on the card.

## Deployment

Push to `main` → GitHub Actions builds and deploys to Azure Static Web Apps automatically.
PRs get a preview deployment at a staging URL (posted as a PR comment).
Review the preview, then merge the PR yourself — merging to `main` triggers the production deploy.

## Process, Backlog & Versioning

This project runs on three living docs, all in the repo root:

- **CLAUDE.md** (this file) — architecture, conventions, gotchas. The durable "how we build here" layer.
- **[BACKLOG.md](./BACKLOG.md)** — candidate work, captured with context (Why / Notes / code pointers) at the moment it's deferred, and **maintained** as other work changes it. Grouped by type with rough effort/value. Not a copy of a tracker — it _is_ the tracker.
- **[CHANGELOG.md](./CHANGELOG.md)** — the shipped trail, newest first, [Keep a Changelog](https://keepachangelog.com/) format, versioned with [semver](https://semver.org/).

Both `BACKLOG.md` and `CHANGELOG.md` are rendered on the site (`/backlog/`, `/changelog/`) via `themes/squalr/layouts/_default/doc.html`, which `readFile`s the root markdown at build time. The thin content stubs (`content/backlog.md`, `content/changelog.md`) just point at the source file via a `sourceFile` frontmatter param.

**Versioning is changelog-derived.** There is no version constant. The footer in `baseof.html` reads the top `## [X.Y.Z]` heading out of `CHANGELOG.md` at build time and renders the version chip. Adding a new changelog block **is** the version bump — keep the latest version at the very top.

**Shipping a backlog item** follows a fixed checklist (semver rules, changelog migration, doc updates, build gate, branch → PR → manual merge) — see [BACKLOG.md → Shipping a backlog item](./BACKLOG.md#shipping-a-backlog-item). Always run `hugo --minify` as the correctness gate before opening the PR (no Dart Sass needed — the theme is plain CSS).

## Known Issues / Tech Debt

The 2021-era debt is resolved (GA4 live, Hugo pinned, GitHub Actions current, owned theme, NFT embeds stripped). Remaining candidates live in **[BACKLOG.md](./BACKLOG.md)** — notably: no mobile pass yet, no accessibility pass yet, fonts still load from Google Fonts, and OpenSea is still in the CSP allowlist. `docs/TECH-STACK-AUDIT.md` is a historical snapshot of the _starting_ state, now largely superseded.

---

## Writing Style Guide

Use this when drafting or editing posts on Chad's behalf. The goal is to match his voice so closely that he could publish without heavy editing.

### Voice & Tone

- **Conversational and direct.** Write like you're explaining something to a smart colleague over coffee, not presenting a formal report.
- **Self-aware, occasionally self-deprecating.** Don't take yourself too seriously. Acknowledge when you're still figuring something out.
- **Opinionated but not preachy.** State a clear point of view, back it up, and move on. Don't lecture.
- **Practical over theoretical.** The "so what" matters more than the academic definition. Get to the application.

### Structure

- Open with a punchy hook — a question, a cost figure, a relatable frustration, a bold claim. Don't ease in.
- Use `## tldr;` at the top of longer posts when a reader might want the summary first.
- Use H2s to section the post, H3s for subsections. Don't over-nest.
- Close with a brief conclusion that either opens a door ("I'm curious to see where this goes") or makes a final practical recommendation. Friendly, not formal.

### Sentence & Paragraph Style

- Short sentences. Short paragraphs. One idea per paragraph.
- Use `_italics_` for emphasis on a single word, `**bold**` for key terms being introduced.
- Use `> blockquotes` for external citations and official definitions — then follow with your own interpretation.
- Use numbered lists for sequential steps. Use bulleted lists for non-ordered items.
- Inline code for technical identifiers (`config.yaml`, `hugo serve`, HTTP header names).

### Word Choice

- Contractions: always. ("It's", "I've", "don't", "can't")
- "folks" over "people" or "users" in informal context
- "spin up", "kick off", "wire up" — pragmatic dev jargon is fine
- Avoid: "leverage", "utilize", "in order to", "it is worth noting that"
- Academic hedging ("one might argue", "it could be said") — skip it, just say it
- Swearing: light, occasional, and always for emphasis ("WTF is NFT")

### Technical Writing

- Show the actual command, config, or code — don't just describe it
- Screenshots are evidence. Use them to prove results (before/after, error states, dashboards)
- Tables for comparisons (browser results, cost breakdowns, option tradeoffs)
- Mention the "why" behind a technical choice, not just the "what"
- Acknowledge tradeoffs honestly. If something has a real downside, say so.

### Common Patterns Chad Uses

- Presenting a problem before the solution ("How long is this going to take?")
- Linking out to reference material without over-explaining it (let the link do the work)
- Embedding real artifacts: GitHub gists, actual screenshots, real cost figures
- Citing concrete numbers ($9.67/mo, 99%, 8 weeks of velocity data)
- Sharing personal experience ("When I tried...", "I noticed...", "My observation was...")
- Light humor in titles/headings ("My Journey: How I Became Rich from Selling NFTs*")

### What to Avoid

- Long introductory paragraphs that don't add value
- Hedging conclusions ("time will tell", "only the future knows")
- Passive voice
- Fluff phrases like "In this post, we'll explore..."
- Repeating the same point in different words to pad length
- Ending on a vague "I hope you found this helpful"

### Content Categories (in order of frequency)

1. Azure / cloud infrastructure / hosting
2. Web performance and security (headers, CSP, caching)
3. Software engineering process (estimation, prioritization, documentation, team dynamics)
4. Tools and automation (GitHub Actions, CI/CD, developer workflow)
5. Tech industry takes (AI, gaming, web3 — skeptical but curious lens)
6. Game dev and personal projects (growing, this is a gap worth filling)
