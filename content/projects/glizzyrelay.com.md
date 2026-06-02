---
title: "Glizzy Relay"
date: 2026-05-09T00:00:00+00:00
status: active
image: /img/projects/glizzyrelay.com/featured.png
# Gallery — shown when drilling into this project:
# gallery:
#   - src: /img/projects/glizzyrelay.com/scoreboard.png
#     caption: "ESPN-style broadcast scoreboard"
#   - src: /img/projects/glizzyrelay.com/timer.png
#     caption: "Tap / spacebar race-day timer"
tags:
  - react
  - typescript
  - supabase
  - side-project
tech:
  - React
  - TypeScript
  - Supabase
  - Vite
demo: "https://glizzyrelay.com"
---

Live scoreboard and scoring for a hot dog eating relay. Glizzy Relay runs the whole event: teams of three eat a hot dog and drink a beer in sequence, a tap/spacebar timer captures every runner's split, and an ESPN-style broadcast scoreboard updates live on the big screen as the race happens.

It started as a stopwatch replacement for a real event I judge — the Hot Dog Eating Relay at Halcyon Brewing in Seattle — and grew into a hostable platform: anyone can sign in, schedule their own event, roster teams, and run race day end to end. It's free, no ads, public or private events.

## What it does

- **Race timer** — tap or spacebar to start, tag, and finish each leg. Per-leg splits captured automatically. Screen wake lock so the laptop doesn't sleep mid-race.
- **Broadcast scoreboard** — fixed 1920×1080 projection canvas with a live race clock, podium standings, individual leaderboard, gap-to-leader, and a pre-event countdown that auto-falls-through to live standings.
- **Exhibition division** — staff teams race for time but never consume a prize-eligible spot.
- **Events** — public or private, with rosters, prizes, sponsors, and the official rulebook. Owners manage their own; a commissioner manages all.

## Stack

| Concern | Choice |
|---|---|
| Frontend | React 19 + Vite 8 + TypeScript |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend | Supabase — Postgres + Auth + Realtime |
| Auth | Google OAuth via Supabase Auth |
| Analytics | GA4 + PostHog |
| Hosting | Netlify |

## How it works

Every action follows one path: the UI updates optimistically, the change persists to Postgres, and a Supabase Realtime event reconciles every connected client back to database truth. The same-device timer talks to the scoreboard over `localStorage` for instant, network-free sync; cross-device sync happens when results are applied.

Authorization is real Row Level Security at the database, with route guards layered on top for UX. Even archived events are locked by Postgres `BEFORE` triggers, not just disabled buttons.

## Related posts

- Building Glizzy Relay, Part 1: From Stopwatch to v1.0.0
