# CLAUDE.md — squalr.us

Personal blog for Chad Schulz. Hugo static site, hosted on Azure Static Web Apps.

## Common Commands

```bash
# Local development
hugo serve                          # dev server at localhost:1313
hugo serve -D                       # include draft posts
hugo new ./blog/{post-name}.md      # create a new post from archetype
hugo --minify                       # production build → public/
```

No npm, no node_modules. Hugo handles everything including SCSS compilation.

## Project Structure

```
content/
  blog/           # published posts (.md)
  blog/draft/     # draft posts (not committed to published history)
layouts/
  _default/
    baseof.html   # base template override (adds fingerprinted CSS, GA)
static/
  img/            # images organized by post slug under static/img/blog/
  staticwebapp.config.json  # cache + security headers for Azure
themes/
  m10c/           # git submodule — current theme (being replaced)
config.yaml       # site config, social links, menu, color palette
```

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

## Adding a Project

Projects live in `content/projects/*.md` and render via `themes/squalr/layouts/projects/`.

Supported frontmatter:
```yaml
---
title: "Project Name"
status: active          # active | wip | paused | archived (emoji + colored pill)
featured: true          # pink-accented card + ★ badge on the featured image
weight: 10              # sort order (lower = first)
tech: [TypeScript, Go]  # shown as tags
repo: https://...       # optional; renders "GitHub ↗"
demo: https://...       # optional; renders "Demo ↗"
links:                  # optional; arbitrary labelled links
  - label: "Live ↗"
    url: "https://..."
# image: /img/projects/<slug>/featured.png   # featured pic (card + detail header)
# gallery:                                    # drill-in gallery on the detail page
#   - src: /img/projects/<slug>/shot.png
#     caption: "What this shows"
---
```

Images go in `static/img/projects/<slug>/` (drop-zone folders already exist). `image` and
`gallery` are optional — cards and detail pages degrade gracefully to text-only when absent.

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

**Shipping a backlog item** follows a fixed checklist (semver rules, changelog migration, doc updates, build gate, branch → PR → manual merge) — see [BACKLOG.md → Shipping a backlog item](./BACKLOG.md#shipping-a-backlog-item). Always run `hugo --minify` (with Dart Sass on `PATH`) as the correctness gate before opening the PR.

## Known Issues / Tech Debt

See `TECH-STACK-AUDIT.md` for full details. Short version:
- Google Analytics UA is defunct since July 2023, needs GA4 migration
- GitHub Actions workflows use outdated action versions
- Hugo version is unpinned
- NFT post embeds (`<nft-card>`) are broken

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
