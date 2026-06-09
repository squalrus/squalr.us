---
title: "squalr.us"
slug: squalr-us
date: 2017-08-12T00:00:00+00:00
description: "This very site. A custom Hugo theme with too many neon glows and a healthy disrespect for whitespace."
status: wip
image: /img/projects/squalr.us/featured.png
demo: "/"
tech:
  - Hugo
  - SCSS
  - Azure Static Web Apps
  - GitHub Actions
---

Personal blog and project showcase built on Hugo with a fully custom theme — Cyber-Shack, a love letter to 90s GeoCities. The goal was to build something that felt genuinely lived-in: Windows 95 chrome, a WinAmp now-playing widget, a sparkle cursor, a guestbook, and way too many neon glows.

The theme is handwritten SCSS compiled through Hugo's asset pipeline — no npm, no node_modules, no frameworks. Every visual detail (the candy-stripe scrollbars, the construction-site badge, the blink animations) is a deliberate callback to the era.

Deployed to Azure Static Web Apps via GitHub Actions. PRs get a staging preview automatically; merging to main triggers the production deploy. The version chip in the footer is read directly from `CHANGELOG.md` at build time — no separate version constant to keep in sync.

## Why

The site needed a facelift. But generic themes all look the same, and anything AI-generated looks even more the same. I wanted something that was clearly mine — opinionated, a little weird, instantly recognizable.

The GeoCities direction wasn't nostalgia for its own sake. It was a way to make design choices that no template would make for you: the marquees, the construction badge, the WinAmp widget. Every detail had to be deliberate because none of it came for free. Claude helped bring it together — which felt fitting for a site that's partly about building with AI.
