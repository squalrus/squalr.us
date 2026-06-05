---
title: "squalr.us"
slug: squalr-us
date: 2017-08-12T00:00:00+00:00
description: "This very site. A custom Hugo theme with too many neon glows and a healthy disrespect for whitespace."
status: wip
# Featured image — shown on the project card and at the top of this page:
image: /img/projects/squalr.us/featured.png
# Gallery — shown when drilling into this project:
# gallery:
#   - src: /img/projects/squalr.us/homepage.png
#     caption: "Homepage"
demo: "https://squalr.us/"
tech:
  - Hugo
  - SCSS
  - Azure Static Web Apps
  - GitHub Actions
featured: true
---

Personal blog and project showcase built on Hugo with a fully custom theme — Cyber-Shack, a love letter to 90s GeoCities. The goal was to build something that felt genuinely lived-in: Windows 95 chrome, a WinAmp now-playing widget, a sparkle cursor, a guestbook, and way too many neon glows.

The theme is handwritten SCSS compiled through Hugo's asset pipeline — no npm, no node_modules, no frameworks. Every visual detail (the candy-stripe scrollbars, the construction-site badge, the blink animations) is a deliberate callback to the era.

Deployed to Azure Static Web Apps via GitHub Actions. PRs get a staging preview automatically; merging to main triggers the production deploy. The version chip in the footer is read directly from `CHANGELOG.md` at build time — no separate version constant to keep in sync.
