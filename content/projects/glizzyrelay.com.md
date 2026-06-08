---
title: "Glizzy Relay"
date: 2026-05-09T00:00:00+00:00
description: "Event management and live scoring app for the Hot Dog Eating Relay — teams of three race a hotdog and a beer, sequentially, against the clock."
status: active
image: /img/projects/glizzyrelay.com/featured.png
# Gallery — shown when drilling into this project:
gallery:
   - src: /img/projects/glizzyrelay.com/1-home.png
     caption: "Homepage"
   - src: /img/projects/glizzyrelay.com/2-events.png
     caption: "Events"
   - src: /img/projects/glizzyrelay.com/3-faq.png
     caption: "FAQ"
   - src: /img/projects/glizzyrelay.com/4-profile.png
     caption: "Profile"
   - src: /img/projects/glizzyrelay.com/5-event.png
     caption: "Event detail"
   - src: /img/projects/glizzyrelay.com/6-scoreboard.png
     caption: "Scoreboard"
tech: [TypeScript, React, Vite, Tailwind CSS, Supabase, PostgreSQL, Netlify]
demo: "https://glizzyrelay.com"
---

Glizzy Relay is the full-stack web platform behind the Hot Dog Eating Relay — a team event where three competitors eat a hotdog and drink a beer in sequence, with the combined leg times as the team score. The app handles the entire event lifecycle: scheduling and configuring events, rostering teams with per-member splits, running a spacebar/tap-driven live timer with screen wake lock, and broadcasting an ESPN-style projection scoreboard that syncs in real time.

The scoreboard is the centerpiece. It renders a fixed 1920×1080 canvas (scaled to any viewport) with podium standings, an individual runner leaderboard, gap-to-leader columns, and a pulsing "On the Clock" indicator for whoever is mid-leg. Before the event starts it shows a first-whistle countdown with team registration counts; the transition to live racing is seamless. An exhibition division lets teams compete for time without being prize-eligible — they interleave into the standings by finish time but hold a `—` rank slot so they never displace a prize position.

The data architecture is optimistic-local with Supabase persistence and Realtime echo: every user action updates the React state immediately via a reducer, drains to Supabase through a dispatch queue, and is then replaced by DB truth when Supabase Realtime fires. Same-device timer-to-scoreboard sync runs over `localStorage` events for zero-latency live updates during a race; cross-device sync propagates only after "Apply" writes times to Postgres. Access control is two-layered — route guards and UI disables for UX, with RLS policies and `BEFORE` triggers on the database as the real enforcement layer.

The app supports three roles (anonymous viewer, authenticated host, commissioner), public and private events, a configurable prize purse with sponsor tickers, and a curated event-art library for per-event visual branding. A `/changelog` page renders the live release notes at build time from `CHANGELOG.md`, and an "On Deck" roadmap section gives transparency into upcoming directions. The next major planned feature is Leagues — persistent account-owned teams, season scheduling, and cross-event stats.

## Why

Nobody asked for this. That was kind of the point — it was an obsession project, built because the idea was too fun not to build.

It was also the first time I coded seriously with Claude, which changed how the whole thing felt. And it was a natural place to finally try Supabase and PostgreSQL — a real app with relational data, auth, and realtime sync was a better proving ground than a toy project. The event gave the app a reason to exist; the app gave the stack a reason to get complex.
