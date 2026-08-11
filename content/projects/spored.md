---
title: "Spored"
date: 2026-08-10T00:00:00+00:00
description: "A hyperlocal neighborhood discovery app — browse local venues on a map, check in, claim business coupons, follow events, join challenges, and earn badges. Launching in Phinneywood, Seattle."
status: active
image: /img/projects/spored/featured.jpg
tech: [TypeScript, Next.js, React, Express, Supabase, PostgreSQL, Tailwind CSS, Turborepo, Google Maps API]
repo: https://github.com/squalrus/blockwise
demo: https://tryspored.com
---

Spored is a hyperlocal neighborhood app: browse local venues on a map, check in when you visit, claim and redeem business coupons, follow events, join challenges, and earn badges along the way. It's launching first in **Phinneywood, Seattle**, but the data model and admin tooling are built to onboard additional neighborhoods without a code change — a neighborhood admin can draw a boundary on a map, and the nightly Google Places sync takes it from there.

The app is free for end users; monetization lives entirely on the business side, through claimed listings and credits for POIs, events, and coupons. Businesses get a dashboard to post events and coupons and track claims/redemptions, while neighborhood admins get their own tools for curating venues, running the boundary sync, and managing local events.

It's a monorepo — a Next.js consumer web app, a Next.js marketing site, and an Express API (deployed as a Netlify Function), all sharing TypeScript types and Supabase/Postgres underneath. Turborepo ties the workspaces together. Still pre-1.0 and shipping fast — new features (coupons, event feeds, feedback submissions) have been landing every week or two.

## Why

I love the neighborhood I live in, Phinneywood — I'm involved in community committees and volunteering there, so a lot of this comes from wanting a better way to surface what's actually happening locally: the businesses, the events, the people. I've also wanted to build a location-based app in the spirit of old-school Foursquare for a long time. The name and the whole "spore" motif came from thinking about mycelial networks — the idea of an underground network quietly connecting everything in a neighborhood felt like exactly the right metaphor for what this app is trying to do.
