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
    - '$ /ship-from-backlog'
    - '✓ v1.1.0 tagged → pushed'
---

Runway is a Claude Code skill plugin that solves a specific problem with AI-assisted solo development: context loss between sessions. Every new Claude Code window starts cold. Runway fixes that by keeping three markdown files — `CHANGELOG.md`, `BACKLOG.md`, and `CLAUDE.md` — checked into your repo and continuously current with the code. Open a new session and Claude already knows what shipped, what's coming, and how to approach the project.

The workflow is driven by two slash commands. `/add-to-backlog` takes a plain-English description of a bug, feature, or idea and writes a structured entry — classified by type and effort, with relevant code context pulled in automatically. It's designed to be fast so you can capture ideas while they're flowing without breaking momentum. `/ship-from-backlog` does the full release dance: version branch, changelog entry, version bump, build, commit, and push. Both commands bootstrap their required files on first run, so there's nothing to set up manually.

What makes this approach interesting is that the files maintain themselves. Because they live in the repo alongside the code, they stay accurate as the project evolves — a bug fixed by a new feature disappears from the backlog, a feature description updates when its implementation path changes. The context is always a snapshot of where things actually stand, which also means meaningful token savings: every session starts from a current state rather than reconstructing history from scratch.

Runway started as a personal workflow across three projects — [Glizzy Relay](https://glizzyrelay.com), [squalr.us](https://squalr.us), and Desktop Tracker — before being generalized into a plugin. One early test was integrating with a project that already had a running changelog in a different versioning format; Runway bootstrapped the missing files and adapted to the existing format rather than overriding it. That behavior felt like exactly the right default for a tool that's supposed to meet you where you are.
