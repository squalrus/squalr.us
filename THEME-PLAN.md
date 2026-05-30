# Custom Hugo Theme Plan — squalr.us

## Goals

1. Replace the m10c submodule with a fully owned, custom Hugo theme
2. Add a **Projects** section to showcase personal projects
3. Enable blog posts to link to and reference projects
4. Preserve the existing visual identity (dark mode, cyan accent, sidebar layout)
5. Maintain the site's performance and security posture (no new external dependencies)
6. Keep the zero-npm philosophy — Hugo handles everything

---

## Design System

### Color Palette (unchanged from current)

| Variable | Value | Usage |
|---|---|---|
| `--color-darkest` | `#242930` | Page background |
| `--color-dark` | `#353b43` | Sidebar, code blocks, cards |
| `--color-light` | `#afbac4` | Body text |
| `--color-lightest` | `#ffffff` | Headings, strong emphasis |
| `--color-primary` | `#52F0E0` | Accent: links, borders, tags, hover states |

### Typography

- Body: system font stack (no web fonts — performance)
- Monospace: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- Base size: `16px`, line-height `1.6`
- Headings: slightly heavier weight, `color-lightest`

### Layout

Fixed sidebar (20rem) + scrollable content area. Same as current.

```
┌─────────────────────────────────────────────────────────┐
│  [Sidebar 20rem fixed]  │  [Content area, max 65rem]    │
│                         │                               │
│  Avatar                 │  Page content                 │
│  Chad Schulz            │                               │
│  Title                  │                               │
│  Nav links              │                               │
│  ─────                  │                               │
│  Social icons           │                               │
└─────────────────────────────────────────────────────────┘
```

Mobile (< 940px): sidebar collapses to a horizontal header bar.

---

## Site Navigation

Update `config.yaml` menu to add Projects:

```yaml
menu:
  main:
    - identifier: 'home'
      name: 'Home'
      url: '/'
      weight: 10
    - identifier: 'projects'
      name: 'Projects'
      url: '/projects/'
      weight: 20
    - identifier: 'tags'
      name: 'Tags'
      url: '/tags/'
      weight: 30
    - identifier: 'about'
      name: 'About'
      url: 'https://github.com/squalrus'
      weight: 40
    - identifier: 'chillout'
      name: 'Chillout'
      url: '/chillout-with-chad/'
      weight: 50
```

---

## Projects Section

### Content Model

Projects live in `content/projects/` as individual markdown files. Each project is a Hugo page with structured frontmatter.

```yaml
---
title: "merge-bot"
date: 2019-10-01T00:00:00+00:00
description: "GitHub Action for automated PR merging based on labels and review state."
status: active          # active | archived | wip
repo: https://github.com/squalrus/merge-bot
demo: ""                # live URL, if applicable
image: /img/projects/merge-bot.png   # card/hero image
tech:
  - GitHub Actions
  - TypeScript
  - Node.js
featured: true          # show on homepage
weight: 10              # ordering
---

Full project description in markdown here. Can be long-form.
```

### Project List Page (`/projects/`)

Card grid. Each card shows:
- Project name (linked to detail page)
- Short description
- Tech tags (styled like current blog tags)
- Status badge (active / archived / wip)
- Links: GitHub repo icon, live demo icon (if applicable)
- Optional thumbnail image

Layout: 2-column grid on desktop, 1-column on mobile.

### Project Detail Page (`/projects/slug/`)

Full-width content (same as blog post layout):
- Hero section: title, status, links (GitHub + demo)
- Tech stack tags
- Long-form description (the markdown body)
- Related blog posts section (see below)
- Screenshot gallery (if images exist in frontmatter array)

---

## Blog Post → Project Linking

### Option A: Frontmatter reference (recommended)

On a blog post, add a `projects` list referencing project slugs:

```yaml
---
title: "GitHub Pull Request Automation with GitHub Actions"
date: 2019-10-17T00:00:00+00:00
tags:
  - github
  - workflow
projects:
  - merge-bot
---
```

The blog post template reads the `projects` param, looks up each project page, and renders a "Related Projects" section at the bottom of the post.

### Option B: Project references posts

On a project page, add a `related_posts` list. Simpler but requires manual maintenance in both directions.

### Implementation

In `layouts/blog/single.html`:
```
{{- with .Params.projects }}
  <section class="related-projects">
    <h3>Related Projects</h3>
    {{- range . }}
      {{- $project := site.GetPage (printf "projects/%s" .) }}
      {{- with $project }}
        <!-- render project card -->
      {{- end }}
    {{- end }}
  </section>
{{- end }}
```

On project detail pages, use Hugo's `site.RegularPages` to find posts that reference the project slug:
```
{{- $slug := .File.ContentBaseName }}
{{- $relatedPosts := where site.RegularPages "Params.projects" "intersect" (slice $slug) }}
```

---

## Theme File Structure

```
themes/squalr/
├── theme.toml
├── assets/
│   └── css/
│       ├── main.scss
│       ├── _variables.scss
│       ├── _layout.scss
│       ├── _sidebar.scss
│       ├── _blog.scss
│       ├── _projects.scss
│       └── _syntax.scss
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── list.html
│   │   └── single.html
│   ├── blog/
│   │   ├── list.html
│   │   └── single.html
│   ├── projects/
│   │   ├── list.html
│   │   └── single.html
│   ├── partials/
│   │   ├── head.html
│   │   ├── sidebar.html
│   │   ├── nav.html
│   │   ├── social.html
│   │   ├── post-meta.html
│   │   ├── tags.html
│   │   ├── project-card.html
│   │   └── related-projects.html
│   └── index.html
└── static/
    └── (theme-level static assets if needed)
```

---

## Page Templates

### Homepage (`layouts/index.html`)

- Recent blog posts (last 5–10)
- Featured projects grid (where `featured: true`)
- No about section — the sidebar already covers bio

### Blog List (`layouts/blog/list.html`)

- Paginated list of posts (15 per page, same as current)
- Post title, date, tags, summary (auto-generated from `<!--more-->` or first 200 chars)

### Blog Post (`layouts/blog/single.html`)

- Title, date, reading time
- Tags
- Body content
- Related Projects section (if `projects` param set)
- No comments system

### Projects List (`layouts/projects/list.html`)

- Card grid of all projects
- Filter by status and tech (Hugo taxonomy or JS-free CSS approach)
- Sort by `weight` then `date`

### Project Detail (`layouts/projects/single.html`)

- Header: title, status badge, GitHub + demo links
- Tech tags
- Body (markdown)
- Related blog posts
- Screenshot gallery (if defined in frontmatter)

---

## Content Types & Hugo Configuration

Add to `config.yaml`:

```yaml
# Content types
outputs:
  home:
    - HTML
    - RSS

# Taxonomies
taxonomies:
  tag: tags
  tech: tech   # reuse "tech" frontmatter as a taxonomy for projects

# Permalinks
permalinks:
  blog: /:year/:month/:title/
  projects: /projects/:slug/
```

---

## Styling Details

### Project Cards

```
┌─────────────────────────────────────┐
│  [Image / placeholder]              │
│─────────────────────────────────────│
│  merge-bot                [active]  │
│  Automated PR merging...            │
│                                     │
│  [TypeScript] [GitHub Actions]      │
│                                     │
│  [GitHub ↗]  [Demo ↗]             │
└─────────────────────────────────────┘
```

- Background: `--color-dark`
- Border-left: 3px `--color-primary` on hover
- Transition: subtle lift (`transform: translateY(-2px)`) on hover
- Status badge: small chip — green for active, gray for archived, amber for wip

### Blog Post Improvements Over Current

- Reading time estimate in post meta
- Tag list at top and bottom of post
- Smooth anchor links for H2/H3 headings
- Code block: language label in top-right corner
- Blockquote attribution line support (`_Source_` on its own line)

---

## What to Preserve from m10c

- Fixed sidebar layout with avatar
- Dark background + cyan primary accent
- Code block styling (left-border accent, dark background)
- Tag badge styling
- Pagination

## What to Improve

- Remove hardcoded Microsoft auth script
- Dynamic copyright year
- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<aside>`, `<article>`)
- Better `<head>` with open graph, twitter card, and canonical URL partials already built in
- Cleaner SCSS with CSS custom properties (easier theming in the future)
- No external font loading (system font stack)

---

## Implementation Phases

### Phase 1 — Theme scaffold (1–2 sessions)

- Create `themes/squalr/` directory
- Port existing styles from compiled m10c CSS to clean SCSS
- Recreate all existing layouts (homepage, blog list, blog post)
- Remove the m10c submodule
- Verify parity with current site

### Phase 2 — Projects section (1–2 sessions)

- Create project content type with frontmatter schema
- Build project list and detail templates
- Add project card partial
- Add to navigation
- Migrate any existing projects (merge-bot, hugo-on-azure template) as initial content

### Phase 3 — Cross-linking & polish (1 session)

- Blog post → related projects
- Project detail → related blog posts
- Tag/tech taxonomy pages
- Open graph images
- Reading time
- Dynamic copyright year

### Phase 4 — Cleanup (1 session)

- Drop OpenSea from CSP after fixing NFT post
- Remove Microsoft auth script
- Update GitHub Actions to use `actions/checkout@v4`, pin Hugo version
- Migrate to GA4
