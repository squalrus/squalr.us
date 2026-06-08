---
title: "Car Rainbow"
date: 2023-01-09T00:00:00+00:00
description: "A road-trip game for kids: spot a real car of each rainbow color out the window and check it off — with expanded color sets and an in-order 'hard mode'."
status: active
image: /img/projects/car-rainbow/featured.png
tech: [React, Sass, Parcel, Playwright, Vitest]
repo: https://github.com/squalrus/car-rainbow
demo: https://carrainbow.quest/
terminal:
  label: 'car-rainbow — v1.14.1'
  lines: ['$ are we there yet?', '✓ red ✓ orange ✓ yellow', '✓ green ✓ blue ✓ purple', '🎉 you did it!']
---

Car Rainbow is a passenger-seat game built for actual car trips: kids (and the adults riding along) look out the window for real cars in each color of the rainbow and tap to check them off as they're spotted. Clear every color and a "you did it" dialog celebrates the win, bumps a running counter, and resets the board for the next stretch of highway. An expanded-colors mode adds trickier shades to hunt for, and hard mode raises the stakes further by requiring cars to be spotted in rainbow order — no skipping ahead to the easy ones.

It's a deliberately small app — there's no router or state library, and all of the game state lives in one `CarRainbow.jsx` component flowing down through props via plain hooks (`useState`, `useEffect`). That simplicity makes it a tidy sandbox for trying out tooling: it's bundled with Parcel's zero-config setup, styled with Sass partials, and covered by both Playwright end-to-end visual regression tests and a growing Vitest/React Testing Library unit suite.

The footer's version number is read straight from `package.json`, and every change landing on `main` bumps that version with a matching changelog entry — so what's live always traces back to a specific commit. The game deploys automatically to Azure Static Web Apps via GitHub Actions on every push to `main`, and players can share a win (with a link back to the app) once they've spotted every color.

## Tech Stack

- **React 19** with function components and hooks — all game state lives in `CarRainbow.jsx`
- **Parcel 2** for zero-config bundling (`npm start` / `npm run build`)
- **Sass/SCSS** partials composed into a single stylesheet
- **Playwright** for visual regression coverage, **Vitest + React Testing Library** for component/unit tests
- **Azure Static Web Apps** deployment via GitHub Actions, triggered on pushes to `main`

## Why

We were already playing this game on road trips — just calling out car colors out loud. I wanted something quick and fun to make it official, so I built an app around it for the kids. Small scope, real use case: exactly the right conditions for a side project.

It also doubled as a React refresher and an excuse to try out Parcel. Both delivered — Parcel's zero-config setup made the tooling invisible so I could focus on the game itself, and keeping the whole thing in one component was a deliberate constraint to stay in the spirit of "quick and fun."
