---
title: "Runway"
date: 2026-06-04T19:57:20-07:00
description: "A Claude Code skill plugin that keeps your backlog, changelog, and project context current inside the repo — so every new session picks up exactly where you left off."
status: active
tech: [Claude Code, Markdown]
repo: https://github.com/squalrus/runway
terminal:
  label: 'runway — workflow'
  lines:
    - '$ /add-to-backlog "dark mode flickers on resize"'
    - '✓ classified → bug / effort:low / BACKLOG.md'
    - '$ /pick-from-backlog'
    - '✓ scoped · starting dark-mode fix'
---

Runway is a Claude Code skill plugin that solves a specific problem with AI-assisted solo development: context loss between sessions. Every new Claude Code window starts cold. Runway fixes that by keeping three markdown files — `CHANGELOG.md`, `BACKLOG.md`, and `CLAUDE.md` — checked into your repo and continuously current with the code. Open a new session and Claude already knows what shipped, what's coming, and how to approach the project.

Three slash commands drive the full cycle. `/add-to-backlog` captures a bug, feature, or idea in plain English — classified by type and effort, with relevant code context pulled in automatically. Fast enough to use mid-flow without breaking momentum. `/pick-from-backlog` surfaces candidates ranked by the backlog's own ordering, briefs you on scope and the "why" behind the chosen item, and starts the work. `/ship-from-backlog` does the full release dance: version branch, changelog entry, version bump, build, commit, and push. All three commands bootstrap their required files on first run, so there's nothing to set up manually.

What makes this approach interesting is that the files maintain themselves. Because they live in the repo alongside the code, they stay accurate as the project evolves — a bug fixed by a new feature disappears from the backlog, a feature description updates when its implementation path changes. The context is always a snapshot of where things actually stand, which also means meaningful token savings: every session starts from a current state rather than reconstructing history from scratch.

Zoom out and a repo's documentation tells one story across five files. `README.md`, `CONTRIBUTING.md`, and `CLAUDE.md` describe what the project _is_, frozen at this moment — the front door, the house rules, the approach. `CHANGELOG.md` and `BACKLOG.md` face in opposite directions along the timeline: the changelog ramps _up_ as the record of what shipped, the backlog ramps _down_ as the unshipped future narrows toward "now." Runway leaves identity to you and owns the other three — keeping `CLAUDE.md` accurate, `CHANGELOG.md` growing, and `BACKLOG.md` converging.

![Diagram of a runway: a ramp on the left labeled CHANGELOG.md climbs up as the record of what shipped, a flat plateau in the middle holds README.md, CONTRIBUTING.md, and CLAUDE.md as the project's current identity, a ramp on the right labeled BACKLOG.md descends as the future narrows toward "now," and an arrow underneath reads "progress rolls forward — yesterday's backlog becomes today's changelog"](/img/projects/runway/docs-lifecycle.svg)

Runway started as a personal workflow across three projects — [Glizzy Relay](https://glizzyrelay.com), [squalr.us](/), and Desktop Tracker — before being generalized into a plugin. One early test was integrating with a project that already had a running changelog in a different versioning format; Runway bootstrapped the missing files and adapted to the existing format rather than overriding it. That behavior felt like exactly the right default for a tool that's supposed to meet you where you are.

## Why

Deep in building Glizzy Relay, ideas were coming faster than I could act on them. I needed somewhere to put them — but not just a list. I wanted them structured, versioned, living next to the code. So I started keeping `BACKLOG.md` and `CHANGELOG.md` in the repo and wiring them into the Claude Code workflow. Once it clicked, I wrote it all down in `CLAUDE.md` so the next session could just pick up and go.

When I moved on to other projects, I missed it immediately. So I abstracted it, dropped it into each new repo, and refined it as I went. By the third project the pattern was stable enough to package. If it solved the problem for me across that many contexts, it'd probably solve it for someone else too.
