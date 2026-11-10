---
title: "Spored"
date: 2026-08-10T00:00:00+00:00
tags:
  - website
description: "A hyperlocal neighborhood discovery app — check in at local spots, collect a mushroom species for every place and neighbor you find, follow events, claim coupons, and earn badges. Started in Phinneywood, Seattle; anyone can start their own neighborhood."
status: active
image: /img/projects/spored/featured.png
gallery:
  - src: /img/projects/spored/1-check-in.png
    caption: "Check in: nearby spots, slide to check in"
  - src: /img/projects/spored/2-location.png
    caption: "Location page: mushroom patch, Top Caps, and check-in feed"
  - src: /img/projects/spored/3-account.png
    caption: "My account: level, stats, and Spore feed"
  - src: /img/projects/spored/4-badges.png
    caption: "Badges"
  - src: /img/projects/spored/5-collection.png
    caption: "Collection: a mushroom species for every place you find"
  - src: /img/projects/spored/6-mushroom.png
    caption: "Customize your mushroom"
  - src: /img/projects/spored/7-admin-overview.png
    caption: "Neighborhood admin overview: boundary map and stats"
  - src: /img/projects/spored/8-admin-analytics.png
    caption: "Neighborhood admin analytics"
  - src: /img/projects/spored/9-monitoring.png
    caption: "Super-admin monitoring: API performance"
tech: [TypeScript, Next.js, React, Express, Supabase, PostgreSQL, Tailwind CSS, Turborepo, MapLibre GL, Geoapify, Stripe, Netlify]
repo: https://github.com/squalrus/blockwise
demo: https://tryspored.com
links:
  - label: "App ↗"
    url: "https://app.tryspored.com"
---

Spored is a hyperlocal neighborhood app. You check in when you walk into a local spot, earn points and badges, and climb your neighborhood's leaderboard. Think old-school Foursquare, except everything is scoped to one neighborhood instead of a global map. It started in **Phinneywood, Seattle**, and now anyone can start a neighborhood: name it, draw its boundary on a map, import the local businesses and spots inside it, and work through a setup checklist before going live.

The mycelial theme runs through the whole app. Every venue, neighborhood, and neighbor you connect with has its own mushroom "species," which goes into your Collection the first time you find it. Each place grows a 60-day mushroom patch, with one mushroom per visitor sized by how often they show up, and "Top Caps" names its most frequent regulars. "Here now" shows who's at a spot right now, and a 🔥 marks places with people there, so you can go meet them. The app also follows local events (entered by hand or synced from calendar feeds), sends push notifications as an installable PWA, and lets claimed businesses post limited-run coupons that you unlock by checking in.

It's free for end users. Claiming a business listing and running a basic neighborhood are free too. A neighborhood admin can pay a one-time $99 (via Stripe) to unlock Events, Challenges, and Analytics for that neighborhood. It's not a subscription and it doesn't expire. Behind the scenes there's a fair amount of tooling: neighborhood and business admin dashboards with analytics, a super-admin console, and a home-grown monitoring and error-tracking system built on Postgres.

## Under the hood

It's a Turborepo monorepo with a Next.js consumer app (`app.tryspored.com`), a static Next.js marketing site (`tryspored.com`), and an Express API wrapped as a Netlify Function, all sharing TypeScript types and running on Supabase/Postgres. Maps are MapLibre GL on Geoapify vector tiles, and place data comes from Geoapify/OpenStreetMap. It started on Google Maps and Places, but a phased migration moved it off Google to get the cost and licensing under control. Changes go to a persistent dev environment first, and production ships by manual promotion.

It's still pre-1.0 and moving fast: past v0.111, often with several releases in a day.

## Why

I love the neighborhood I live in, Phinneywood — I'm involved in community committees and volunteering there, so a lot of this comes from wanting a better way to surface what's actually happening locally: the businesses, the events, the people. I've also wanted to build a location-based app in the spirit of old-school Foursquare for a long time. The name and the whole "spore" motif came from thinking about mycelial networks — the idea of an underground network quietly connecting everything in a neighborhood felt like exactly the right metaphor for what this app is trying to do.
