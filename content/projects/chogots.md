---
title: "Chogots"
date: 2026-09-12T00:00:00+00:00
tags:
  - gamedev
description: "A pixel-art creature-care game for Android with a deadpan sense of humor. Hatch an egg, keep its needs up, furnish its room, and play Gem Match to pay for it all. It's probably fine."
status: wip
image: /img/projects/chogots/featured.png
tech: [Unity, C#, Android]
repo: https://github.com/squalrus/chogots
demo: https://games.squalr.us/#chogots
---

Chogots is a pocket creature-care game in the Tamagotchi tradition, except it's dry about it. The status lines read flat and mildly funny instead of cute or urgent: _"Pomu is fine. Pomu has been fine all week."_ The tagline is "It's probably fine."

You tap an egg until it hatches and find out what's inside. Each new chogot is one of six species, picked at random at hatch: Sprig, Hopli, Floof, Dotti, Flit, or Tabbo. Mochi, the original pink chogot, can hatch too. Then you keep up its five needs: food, joy, rest, hygiene, and love. There are 21 foods (it has favorites, and things it won't touch), 11 toys, soap and shampoo, and medicine for when it gets sick. You also have to clean up its messes before the flies show up.

The money comes from **Gem Match**, a match-3 minigame with Easy, Hard, and Endless modes, and it's the only source of coins. Coins buy food, toys, and tools. Each level-up pays out a blue coin for furniture, and there are 15 pieces: seats your chogot actually rests on, a fish tank to feed, a plant to water, and a window that shows the real day or night sky. There are also wall and floor patterns.

It's built to be friendly to idle play. Close the app and your chogot keeps living. Coins get collected and toys get played with while you're away, and a notification only nudges you back when a need is actually about to run out. Every sprite is pixel art generated from code. It's in closed testing on Android, published under [Squalrus Games](/projects/games.squalr.us/). It went from first commit to v0.53 in about seven weeks.

## Why

I grew up with virtual pets, and I've always wanted to make one. Tamagotchi-style games are a perfect small-game format: one creature, a few needs, and a reason to check back in.

What I didn't want was another cutesy one. Most creature-care games lean hard on cute and guilt, with sad faces and urgent alarms whenever you look away. I wanted the opposite voice: a creature that's deadpan, a little sarcastic, and honestly kind of fine without you. It's the same pet loop I loved as a kid, with a sense of humor that fits me now.
