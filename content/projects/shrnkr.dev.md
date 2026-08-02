---
title: "SHRNKR"
slug: shrnkr.dev
date: 2026-08-01T00:00:00+00:00
description: "Satirical token-compression middleware for AI agents — shrinks every prompt and response into fewer, uglier tokens so your bill (allegedly) goes down."
status: wip
image: /img/projects/shrnkr.dev/featured.png
tech: [HTML, CSS, JavaScript, Azure Static Web Apps]
repo: https://github.com/squalrus/shrnkr.dev
demo: https://shrnkr.dev
relatedProjects: [badgefor.me]
---

SHRNKR is a satirical marketing site for a fictional token-compression middleware product that "sits between you and your AI agent," shrinking every prompt and response into fewer, uglier tokens — Wehadababyitsaboy-style word-merging — so your LLM bill goes down and your output quality goes to hell. No tokens are actually saved and no package is actually published; it's a fake dev-tool product through and through.

The site pairs a live text-shrinker demo (drag the compression slider from Garlic Press up to Meat Grinder and watch real copy get mangled) with fabricated before/after case studies, a pricing model that charges 1% of whatever token spend it "saves" you, and a testimonial written entirely in the product's own compressed style. A sibling production of [badgefor.me](/projects/badgefor.me/), sharing its suite-bar and corporate-parody visual language.

Under the hood, the compression pipeline is a real (if absurd) piece of engineering: redundant-phrase detection, punctuation stripping, symbol substitution, adaptive vowel elision, and word merging, with level-specific gimmicks like DLE (Duplicate Letter Elimination) and JDSL (Just Drop Some Letters) to keep the higher levels visibly distinct from each other. It's pure HTML/CSS/JS with no build step or framework, and the shrink algorithm is unit tested and runnable from Node.

## Why

Token pricing anxiety has become its own cottage industry — a constant stream of middleware and tooling promising to shave your LLM bill down by squeezing prompts and responses into fewer tokens. It's an easy, funny target: the pitch always implies the compression is free, when in practice it's trading away readability and meaning to hit a smaller number.

SHRNKR takes that pitch at face value and pushes it to its logical, ugly extreme — a product that's upfront (in its own deadpan way) that it's making your output worse while still taking a cut of the "savings." It's the same satirical-SaaS format as badgefor.me, aimed at a different corner of tech-industry hype.
