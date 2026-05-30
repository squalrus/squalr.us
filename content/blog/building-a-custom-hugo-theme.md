---
title: "Building a Custom Hugo Theme"
date: 2026-06-04T00:00:00+00:00
tags:
  - process
  - website
  - workflow
---

The m10c theme served the blog well for five years. But at some point, a git submodule you don't own starts to feel less like a convenience and more like a dependency you can't audit.

The final nudge: m10c is minimally maintained, wasn't pinned to a specific commit, and I was about to add a Projects section the theme had no concept of. Building a custom theme made more sense than trying to extend someone else's.

## What Hugo themes actually are

A Hugo theme is a directory inside `themes/` with a specific structure:

```
themes/squalr/
├── assets/css/      # SCSS, compiled by Hugo's pipeline
├── data/            # JSON data files (icons, etc.)
├── layouts/         # HTML templates
└── theme.toml       # Metadata
```

Hugo's template lookup tries your project's `layouts/` first, then the theme's. So you can override individual templates without touching the theme — useful when you need a one-off customization without forking everything.

The CSS pipeline runs through Hugo itself. No npm, no webpack, no node_modules. You write SCSS, Hugo compiles and fingerprints it. That's it.

## Porting from m10c

Phase one was parity: a new theme that looks identical to the old one. I initialized the submodule to read the source, then ported each file:

- `_base.scss` — reset, typography, link styles
- `components/_app.scss` — the fixed sidebar and main container
- `components/_post.scss` — content area, blockquotes, code blocks
- Remaining components: tags, pagination, 404, icons

The templates were almost a direct copy. The main change: removing the Disqus footer call from `single.html` (it was wired up but never used) and removing a Microsoft auth script from `baseof.html` that had crept in from work tooling.

One thing worth doing: the m10c theme ships with all 400+ Feather icons as a 53KB JSON file. The templates use nine of them. I extracted those nine into `data/squalr/icons.json` — now 2KB. Smaller payload, no external dependency.

## The icon partial

m10c renders icons from a JSON data file using an inline SVG partial. The partial looks up the icon name in `$.Site.Data.m10c.icons`. Porting to the custom theme meant updating that path to `$.Site.Data.squalr.icons` — one-line change, but easy to miss.

```html
{{- if isset .ctx.Site.Data.squalr.icons .name -}}
<svg ...>
  {{ safeHTML (index .ctx.Site.Data.squalr.icons .name) }}
</svg>
{{- end -}}
```

## Adding the Projects section

With the theme owned, adding a new content type was straightforward. Projects live in `content/projects/` as Markdown files with structured frontmatter:

```yaml
status: active
repo: https://github.com/squalrus/merge-bot
tech:
  - GitHub Actions
  - TypeScript
```

The list page renders a card grid. The detail page shows the project description plus a "Related posts" section — queried by finding all blog posts where `Params.projects` contains the current project's slug:

```html
{{- $slug := .File.ContentBaseName }}
{{- $related := where site.RegularPages "Params.projects" "intersect" (slice $slug) }}
```

Blog posts reference projects the same way, in reverse:

```yaml
projects:
  - merge-bot
```

Hugo looks up the project page and renders a card at the bottom of the post. Both directions work off the same frontmatter — no separate relationship table to maintain.

## What I'd do differently

The SCSS variable approach (injecting config values via `resources.ExecuteAsTemplate`) works, but it's a bit odd — you're treating SCSS as a Hugo template before compiling it. CSS custom properties defined in a `:root` block would be cleaner and easier to override. That's a refactor for another day.

The theme also doesn't have open graph images per-post yet. Hugo has built-in OG support but generating post-specific images requires either a static image per post or a dynamic generation approach. Worth adding when there's content worth promoting.

For now: zero npm, reproducible builds, a theme I can actually modify, and a Projects section that didn't require fighting an upstream dependency. Good enough to ship.
