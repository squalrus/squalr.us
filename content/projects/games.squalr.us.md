---
title: "Squalrus Games"
slug: games.squalr.us
date: 2026-09-22T00:00:00+00:00
tags:
  - gamedev
  - website
  - azure
description: "The studio site for Squalrus Games, my one-person game studio. It has a section for each game, a press kit, and the privacy and support pages that app stores require."
status: active
image: /img/projects/games.squalr.us/featured.png
tech: [React, React Router, Vite, Canvas, Azure Static Web Apps]
repo: https://github.com/squalrus/games.squalr.us
demo: https://games.squalr.us
relatedProjects: [chogots, infinity-space]
---

[games.squalr.us](https://games.squalr.us) is the studio site for **Squalrus Games**, the LLC I put my games out under. The homepage starts with a Squalrus Games header and then gives each game its own section. Right now that's [Chogots](/projects/chogots/) and [Infinity Space](/projects/infinity-space/). Each section has a tagline, a short pitch, a stats row, and a call to action, like signing up for the Chogots closed test on Android. Adding a new game means adding one more section block, with no new routes.

The background on every visit is a procedural starfield of nebulae and galaxies, drawn on `<canvas>` when the page loads. It doesn't ship a single image file. You can drag to pan around, and when you stop it drifts slowly on its own. The Chogots section has its own animated background of floating pixel sprites, pulled straight from the game's art.

The site also covers the boring-but-required stuff: a **press kit** (studio facts, game fact sheets, logo downloads, colors, and fonts), plus **privacy** and **support** pages that cover every title at once. The About page lists a full team of six specialists: CEO, Lead Programmer, Head of QA, Director of Marketing, CFO, and Head of Player Support. Every one of them is me, with the same headshot. The Head of QA and the Lead Programmer are not currently speaking.

It's a small React and React Router single-page app built with Vite and hosted on Azure Static Web Apps. It started as a `Site/` folder inside the Infinity Space repo, back when there was only one game. In September I split it out into its own repo, with history intact, so it could cover more than one game.

## Why

It started out of necessity. Google Play, Steam, Xbox, and Nintendo all want a public URL for a privacy policy and a support contact before they'll take your game, and those pages need to live somewhere better than a GitHub README. Once Chogots joined Infinity Space, it made more sense to have one shared home than to repeat that setup for every game.

Then it grew. If I'm forming an LLC and putting games on store shelves, Squalrus Games should look like a real studio, with one front door for everything it makes instead of a pile of separate repos. So the privacy page got a homepage, the homepage got a press kit, and the press kit got a brand guide.
