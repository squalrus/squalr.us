---
title: "Building a Custom Hugo Theme"
date: 2026-06-11T00:00:00+00:00
tags:
  - process
  - website
  - workflow
projects:
  - squalr.us
---

The m10c theme served this blog well for five years. But a git submodule you don't own starts to feel less like a convenience and more like a dependency you can't audit — and I was about to do things to this site that no off-the-shelf theme was going to sit still for.

So I built my own. Then I redesigned it into a neon arcade cabinet. Here's how both halves went.

## What a Hugo theme actually is

A theme is a directory under `themes/` with a specific structure:

```
themes/squalr/
├── assets/css/      # SCSS, compiled by Hugo's own pipeline
├── data/            # JSON data files (icons, etc.)
├── layouts/         # HTML templates
└── theme.toml       # Metadata
```

Two things make this pleasant. First, Hugo's template lookup checks your project's `layouts/` *before* the theme's, so you can override a single template without forking the whole thing. Second, the CSS pipeline runs through Hugo itself — you write SCSS, Hugo compiles and fingerprints it. No npm, no webpack, no `node_modules`.

## Phase one: parity

The first goal was boring on purpose — a custom theme that looked *identical* to the old one. I initialized the submodule to read the source, then ported each piece: `_base.scss` for reset and typography, component partials for the layout, post content, tags, pagination, and the 404. The templates were nearly a direct copy.

One cleanup worth mentioning: m10c ships all 400+ Feather icons as a 53KB JSON blob. The templates use nine. I pulled those nine into `data/squalr/icons.json` — 2KB, no external dependency.

Parity is the right first move. It de-risks everything: if the new theme renders the existing site pixel-for-pixel, you *know* the port is correct, and every change after that is a deliberate design decision instead of a porting bug you can't tell apart.

## Phase two: lean all the way in

Identical-looking lasted about a day. The whole reason to own the theme was to do something with it.

The site is cyberpunk now: an arcade-pixel hero in Press Start 2P with a neon flicker, a textured background built from four stacked fixed layers (dot grid, horizon glow, CRT scanlines, vignette), and project cards that show either a real screenshot or an auto-generated faux-terminal banner. Teal and cyan on near-black blue, ember orange for punctuation.

A few things I'd actually recommend stealing:

**Make the hero configurable.** I wasn't sure about the headline copy, so I didn't hard-code it. The kicker, the heading lines, the lit word, and the subtitle all come from `config.yaml`:

```yaml
hero:
  lines:
    - 'YEAR'
    - 'OF {SHIPPING}.'
```

A tiny bit of template logic turns `{SHIPPING}` into the glowing `<span>` and the trailing `.` into the ember dot. Changing the headline is a one-line config edit, not a template dig.

**Generate a banner so no card is ever empty.** Projects without a screenshot render a fake terminal built from their own metadata — a `$` command, a comment line, a status line — instead of a blank rectangle. It's driven by an optional `terminal:` frontmatter block with a sensible auto-fallback.

**Cross-link posts and projects off one field.** A post names a project in frontmatter; the project page finds its related posts in reverse. Both directions read the same `projects` array — no relationship table to maintain:

```html
{{ $slug := .File.ContentBaseName }}
{{ $related := where site.RegularPages "Params.projects" "intersect" (slice $slug) }}
```

## The gotchas (there are always gotchas)

Three of these cost me real time. All three are the kind of bug that compiles fine and *looks* fine until it doesn't.

**The SCSS-as-template thing.** The theme injects config colors into SCSS variables via `resources.ExecuteAsTemplate` before compiling. It works, but it's genuinely odd — you're running a `.scss` file through Hugo's templating engine first. At one point the pipeline lost that step and the color variables stopped substituting; a stale build cache kept rendering the *old* compiled CSS, so everything looked correct until I cleared the cache. Lesson: when CSS goes weird, nuke `resources/_gen` before you trust what you're seeing.

**A class-name collision.** My section headings used `<span class="tag">`. So did my blog post tags — a totally separate component with a pill background and a hover glow. The headings silently inherited the pill. The fix was a rename (`sec-tag`), but the lesson is that a flat global CSS namespace will absolutely let two unrelated things fight over a common word.

**A shorthand that ate my spacing.** My centered container set `padding: 0 28px` — and that shorthand quietly zeroes top/bottom padding. Because the container class and the section classes landed on the same elements, and the container was imported *later*, it won the cascade and flattened every vertical gap on the homepage to zero. Everything was crammed together and bumping the section padding did nothing. The fix: use `padding-inline` so the container only ever touches the horizontal axis. Logical properties exist for exactly this reason.

## What's next

The `@import` rules in the SCSS are deprecated in Dart Sass and I'll eventually move to `@use`/`@forward`. The fonts load from Google Fonts; self-hosting them would get the zero-dependency story fully back. Both are in [the backlog](/backlog/) — which, fittingly, is rendered by this very theme.

For now: zero npm, reproducible builds, a theme I can actually modify, and a homepage that looks like it belongs to someone who likes pixels. Good enough to ship.
