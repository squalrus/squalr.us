---
title: "Runway: How I Stopped Losing Project Context Between Claude Code Sessions"
date: 2026-06-04T00:00:00+00:00
tags:
  - ai
  - workflow
  - documentation
projects:
  - runway
---

## tldr

Three markdown files — `CHANGELOG.md`, `BACKLOG.md`, and `CLAUDE.md` — plus two slash commands. That's Runway. It keeps Claude Code oriented across sessions so you're not re-explaining your project from scratch every time.

---

I work on personal projects solo — just me and Claude Code. No sprint planning, no standups, no Jira. But I'm a big fan of process, and when context-switching between sessions started costing me real time, I wanted a better system.

What I built is called **Runway**: a lightweight workflow that lives entirely inside your source code, driven by Claude Code slash commands.

## The Origin Story

It started with [Glizzy Relay](https://glizzyrelay.com). I was tracking bugs and features in my head (bad) and losing thread between Claude Code sessions (worse). So I started keeping a `CHANGELOG.md` — and once I had that, it made sense to document what was _coming_ too. Then I needed a place to capture how to _approach_ the project: the architectural decisions, the known gotchas, the things you always forget.

Three files. That was the whole insight.

When I generalized this into a workflow for [squalr.us](/) and validated it on Desktop Tracker, the pattern held. So I packaged it as a Claude Code skill marketplace plugin.

## The Three Files

Runway is built around three markdown files checked into your repo:

- **`CHANGELOG.md`** — the authoritative record of what shipped and when
- **`BACKLOG.md`** — bugs, features, and ideas, classified by type and effort
- **`CLAUDE.md`** — how to approach the project: architecture decisions, known gotchas, project-specific context

Three slash commands drive the whole thing:

- `/add-to-backlog` — describe something in plain English; Claude pulls relevant code context and writes a structured entry
- `/pick-from-backlog` — surface candidates ranked by the backlog's own ordering, get a scope brief on the chosen item, and start the work
- `/ship-from-backlog` — Claude creates the version branch, writes the changelog entry, bumps the version, builds, commits, and pushes

## The Bigger Picture: Five Docs, One Timeline

Zoom out, and every well-run repo is telling one story across five files.

Three of them describe what the project _is_, frozen at this exact moment:

- **`README.md`** — the front door. What this thing does, how to run it.
- **`CONTRIBUTING.md`** — the house rules. How a change gets in, what "done" looks like.
- **`CLAUDE.md`** — the approach. Architecture calls, known gotchas, the stuff you'd tell a new teammate over coffee.

The other two are time-facing, and they move in opposite directions:

- **`CHANGELOG.md`** ramps _up_. It's the accumulated record of what shipped — it only grows.
- **`BACKLOG.md`** ramps _down_. It's the unshipped future — sprawling and vague out at the horizon, sharper and shorter the closer an item gets to "now."

![Diagram of a runway: a ramp on the left labeled CHANGELOG.md climbs up as the record of what shipped, a flat plateau in the middle holds README.md, CONTRIBUTING.md, and CLAUDE.md as the project's current identity, a ramp on the right labeled BACKLOG.md descends as the future narrows toward "now," and an arrow underneath reads "progress rolls forward — yesterday's backlog becomes today's changelog"](/img/blog/runway-project-context/docs-lifecycle.svg)

Runway doesn't touch `README.md` or `CONTRIBUTING.md` — those are about identity, and identity is yours to write. But it owns the rest of the picture: it keeps `CLAUDE.md` honest as the architecture shifts, keeps `CHANGELOG.md` climbing as you ship, and keeps `BACKLOG.md` converging as the future turns into "now."

## Why This Works for Solo Devs

I didn't need assignees. I didn't need a ticket system where a developer "picks up" a work item. I needed a continuously evolving document that stayed current with the code. Because the files live _in the repo_, they maintain their own relevance. When a new feature eliminates a bug, the bug comes out of the backlog. When a bug fix changes the implementation path for a planned feature, the feature description gets updated to match. No stale tickets rotting in a sidebar.

The other big benefit: **token savings**. Each session starts from a snapshot of where the project actually is. New context window, same mental model. It genuinely feels like you're picking up from exactly where you left off — because you are.

**No new tools to install.** I didn't want to spend time evaluating and wiring up packages like [beachball](https://github.com/microsoft/beachball) just to manage a changelog. With Runway, I wrote what I wanted the workflow to be in plain English, and the skills handle the rest. No config files, no dependencies, nothing to maintain.

**Capturing ideas while they're flowing.** When you're deep in building something, ideas and issues come fast — and you don't want to break flow to write them up properly. With `/add-to-backlog`, I fire off a thought in plain English and keep moving. Claude Code handles the classification, effort estimation, and relevant code context. The idea is captured while it's fresh; the structured backlog item is waiting when I'm ready to act on it.

## How Is This Different from Spec-Driven Development?

Fair question. The key difference is **direction and timing**.

Spec-driven development is prescriptive and upfront — you define what the system should do _before_ you build it, then implement to the spec. The spec is the source of truth, and the code is meant to match it.

Runway is descriptive and continuous. Nothing is written before the code — you're capturing what _is_, what _happened_, and what you _noticed while building_. The backlog isn't a spec; it's a running catch bucket for ideas and issues that surface during active development. The code is the source of truth, and the markdown files stay current with it.

A few other distinctions:

- **Specs are top-down.** Runway is bidirectional — fixing a bug can update a feature description, a new feature can close a bug.
- **Specs are often written once.** Runway files are continuously evolving; they're never "done."
- **Specs prescribe behavior.** `CLAUDE.md` prescribes _approach_ — how to think about the project, not what to build.
- **The AI continuity angle has no spec-driven analog.** Picking up across Claude Code context windows isn't a problem spec-driven workflows were designed to solve.

The closest thing Runway resembles is a _living sprint backlog_ combined with an _architecture decision record_ and a _release log_, all auto-maintained by the AI as a side effect of doing the work.

## A Couple Implementation Details I'm Proud Of

**Lazy bootstrapping.** The first time you run `/add-to-backlog` or `/ship-from-backlog`, Runway checks whether `BACKLOG.md` and `CHANGELOG.md` exist. If they don't, it triggers a separate internal bootstrap skill to create them. The bootstrap logic is _not_ bundled into the main skills — it only gets loaded into context when it's actually needed. Keeps the primary skills lean.

**Format adaptation.** Desktop Tracker already had a running `CHANGELOG.md` with a slightly different versioning format. Runway bootstrapped the backlog, appended to the existing `CLAUDE.md`, and updated the changelog — all while adapting to the format already in place rather than overriding it. That felt like exactly the right behavior.

## Install It

```sh
/plugin marketplace add squalrus/runway
```

Run `/add-to-backlog` once and it sets everything up. Works on an existing project or a fresh one.

If you're shipping personal projects with Claude Code and tired of re-explaining yourself every session, give it a shot.
