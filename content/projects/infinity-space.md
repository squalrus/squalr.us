---
title: "Infinity Space"
date: 2026-06-15T00:00:00+00:00
tags:
  - gamedev
description: "A top-down survival space shooter headed for Android, Xbox, and Steam. Fight through procedurally generated sectors and scavenge ship parts to stay fueled, armed, and alive."
status: wip
image: /img/projects/infinity-space/featured.png
tech: [Unity, C#]
repo: https://github.com/squalrus/infinity-space
demo: https://games.squalr.us/#infinity-space
relatedProjects: [runway]
---

Infinity Space drops the player's ship into a hostile sector and the only way out is through. Waves of enemies and asteroids fill the play area, and survival means scavenging ship parts off everything you destroy. Every sector is procedurally populated, so no two runs spawn the same fight. Clear enough of the sector and a portal opens, dropping you into the next one — with a permanent upgrade screen between runs for research.

The project was originally built in Unity 2018.3, with the last meaningful work done back in 2017, before being resumed in June 2026 on Unity 6 (6000.3.17f1). The gameplay core — ship movement, weapons, AI steering, procedural spawning — survived the jump largely intact, but the surrounding systems didn't: the old Input Manager, `OnGUI` health bars, `BinaryFormatter` saves, and Canvas-based menus all needed replacing. The HUD and every menu screen now run on UI Toolkit instead of Canvas/uGUI, input goes through Unity's new Input System with gamepad support, and saves are plain JSON.

Once the modernization was done, the focus moved to the game loop itself. Ship parts are now the only currency. You spend them mid-run to top off fuel, ammo, or health, or save them for permanent upgrades to speed, firepower, capacity, and more. Sectors vary by type as well as layout:

- standard clears
- **Relic** sectors, where one marked enemy carries an objective you have to collect before it's lost
- **Large Threat** sectors, which swap the swarm for one tough boss with light support

Sectors also add new enemies as you push deeper, plus achievements, mission briefings, homing rockets, and controller and phone rumble. And if you sit around too long, the portal stops waiting for you.

It's now one of two titles under [Squalrus Games](/projects/games.squalr.us/). The marketing site and release-planning docs started out inside this repo. In September they moved to their own home at games.squalr.us, alongside [Chogots](/projects/chogots/). The design document and backlog are still in the repo, so where the game is headed, and what's blocking it, stays public instead of living only in my head.

## Why

This one's old — a project from years back that got shelved when life got in the way. The last meaningful work on it was back in 2017. Picking it back up in 2026 wasn't really planned; it was more that AI tooling finally made resuming a half-finished Unity project from nearly a decade ago actually feasible. Instead of staring at a codebase I half-remembered and giving up, I could audit it, see exactly what had rotted (deprecated APIs, old input system, `BinaryFormatter`), and work through the list methodically. The itch to finish it never went away — what changed was having a practical way back in.

And honestly? I'm pretty excited about it. Excited enough that I can already feel myself wanting to overcommit and overdo it on scope, the same way I always seem to with side projects. Going in aware of that tendency this time, for whatever good that'll do me.
