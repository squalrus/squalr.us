---
title: "The three markdown files that replaced my project tools"
date: 2026-06-02T00:00:00+00:00
slug: the-three-markdown-files-that-replaced-my-project-tools
tags:
  - process
  - ai
  - workflow
  - documentation
projects:
  - squalr.us
  - glizzyrelay.com
tech:
  - Claude
  - Hugo
---

I haven't opened a project board in months. Not because I finally got disciplined — because I stopped needing one.

Every small project I run now lives on three markdown files in the repo: `CLAUDE.md`, `BACKLOG.md`, and `CHANGELOG.md`. That's the whole system. No Jira, no Linear, no Notion database with seventeen custom fields I'll never filter on. Three files, version-controlled, sitting right next to the code they describe.

It's how I wish I'd been building software five years ago.

## tldr

- **`CLAUDE.md`** is the rules of the house — architecture, conventions, gotchas. The stuff you'd otherwise re-explain every single time.
- **`BACKLOG.md`** is the work, captured _before_ it's work — with the context and code pointers pulled in at capture time, then maintained as other things change around it.
- **`CHANGELOG.md`** is the receipts — every shipped change, versioned with [semver](https://semver.org/).
- A version number falls out of the changelog and shows up in the site footer. You're looking at it — scroll down, click the little `v` chip.
- It's lighter than spec-driven development, and it's _maintained_, which is the part that actually matters.

## The old way: code first, context never

Here's the loop I used to run, and I bet you've run it too.

Pick up a feature. Open the editor. Start typing. Three files in, realize you need that auth pattern from somewhere else in the codebase, so go dig for it. Hit a wall, paste the error into a search bar, grab a Stack Overflow snippet that's _almost_ right, mangle it until it fits. Ship it. Move on. The reasoning — why this approach, what you ruled out, what'll break if someone touches it — evaporates the moment the PR merges.

The context existed. It just never got written down anywhere that survived.

So the next person (often me, three weeks later) starts the loop over from zero. Re-derives the same decisions. Re-finds the same snippets. Re-learns the same gotcha that bit them last time.

The cost isn't the typing. It's that nothing compounds.

## Three files

The fix is almost dumb in its simplicity: capture the context at the right moment, in plain text, in the repo. But _which_ context, and _when_, is the whole game.

### CLAUDE.md — the rules of the house

This is the durable layer. How the project is built and why. The data flow. The one weird convention that looks wrong but is load-bearing. The gotcha that'll cost you an afternoon if you don't know it.

It's named for [Claude Code](https://claude.com/claude-code) because that's what reads it first on every task — but don't let the name fool you. It's just as much for the human who shows up next, including future-me. The AI tool and the person need the exact same orientation, so they read the exact same file.

Write it once, and every future session — human or machine — starts oriented instead of guessing.

### BACKLOG.md — the work, captured before it's work

This is the one that changed everything for me.

The backlog isn't a to-do list. It's where I capture a piece of work _at the moment I decide to defer it_ — which is exactly when I have the most context about it. What problem it solves. Why now (or why not yet). The files it'll touch. The snippet pattern to copy. The open question I haven't answered.

> Capture the context when the work is captured — not when you finally sit down to do it.

That inversion is the trick. The old way pulls in code snippets and decisions _while you're coding_, when you're already deep and rushed. This way, the research happens when the idea is fresh and you're thinking clearly, and it's _waiting_ for you when you pick the work up.

And — this is the part that separates it from a notes app — backlog items get **maintained**. When I ship something that changes where a deferred item is heading, I go update that item. A backlog entry from a month ago reflects the codebase as it is _today_, not as it was when I jotted it down. Stale backlog items are worse than no backlog, so they don't get to go stale.

Each item carries a rough **effort** and **value** so "what's next" is obvious at a glance, and there's a fixed checklist for shipping one so the version trail never drifts.

### CHANGELOG.md — the receipts

When a backlog item ships, it moves to the changelog. Dated, classified (`Added` / `Changed` / `Fixed` / `Removed`), written for someone who wants to know what's different. [Keep a Changelog](https://keepachangelog.com/) format, newest on top.

This is the durable record of _what actually happened_, and it doubles as release notes for free.

## Versioning ties it together

Here's where it gets satisfying. The top entry in the changelog carries a [semver](https://semver.org/) version. A feature bumps the minor, a fix bumps the patch, a breaking change bumps the major. Shipping a backlog item _is_ the version bump — you add the changelog block, and the number moves.

On this site, the footer reads that number straight off the top of `CHANGELOG.md` at build time and renders it as a chip. There's no separate version constant to forget to update — the changelog is the single source of truth, and the site just reflects it.

It means the version on the page is always honest. It can't drift, because there's nothing to keep in sync.

And because I'm a sucker for transparency, the [changelog](/changelog/) and the [backlog](/backlog/) are both published right here on the site — rendered from the same files I work from. The roadmap isn't a marketing page; it's the actual file, warts and open questions and all.

## "Isn't this just spec-driven development?"

Kind of! And it's worth being precise about where it overlaps and where it doesn't, because the difference is the whole point.

Spec-driven development (the Kiro / spec-kit lineage) front-loads a formal spec per feature: a `spec.md`, then a `plan.md`, then a `tasks.md`, and the agent implements against them. It's rigorous, and for a big ambiguous feature it's genuinely the right call.

But it's _per-feature_ and _upfront_. You generate the spec, build the thing, and the spec usually goes stale the moment the code lands — a write-once artifact. Three months later it describes a feature that no longer works that way.

What I'm describing is lighter and continuous:

| | Spec-driven | Three-file workflow |
|---|---|---|
| Unit of context | A formal spec per feature | A few durable docs that evolve |
| When | Upfront, before each feature | Continuously, as you go |
| Formality | High — spec / plan / tasks | Low — Why + Notes per item |
| Lifespan | Often write-once | **Maintained as things change** |
| Shipping discipline | Not prescribed | Semver + changelog, built in |
| Best for | Big, ambiguous features | Small projects, solo, fast iteration |

The similarity is the important one, though: **both reject "start coding and paste from Stack Overflow."** Both insist you capture context before you write the implementation. We just disagree on how heavy that capture needs to be, and on whether it sticks around afterward.

If anything, call this the informal cousin. Same family. Less ceremony.

## The tradeoffs (because there are some)

I'm not going to pretend this is free.

**It runs on discipline.** The whole thing falls apart if you don't actually write the backlog item or update the changelog. There's no tool nagging you — the tool _is_ the habit. Skip it for a month and you've got three stale files lying to everyone who reads them.

**It doesn't replace real planning for big work.** A genuinely large feature still wants a written plan before anyone touches code. The backlog even flags those — an `L`-effort item means "go write a plan first." Markdown isn't a substitute for thinking; it's a place to put the thinking.

**It outgrows you if you add people.** No assignees, no sprints, no burndown, no stakeholder who needs a dashboard. The second you've got a team and someone asking "what's the status," you'll want a real tool. This shines specifically for small and solo.

For the projects it fits, though, it deletes an entire category of software from my life — and keeps the context where the work is, readable by the next human _or_ the next AI tool, instead of locked in a SaaS silo behind a login.

## Where this leaves me

Try it on your next small project. You don't need all three files on day one.

Start with `CLAUDE.md` — write down the stuff you're tired of re-explaining. The first time you defer a piece of work, open a `BACKLOG.md` and capture it properly, with the context, right then. The first time you ship a version, start a `CHANGELOG.md`. Wire the version into the footer when you're feeling fancy.

This site runs on exactly that, as of `v1.0.0`. The proof is in the footer — and unlike most "our process" posts, you can click it and read the real thing.
