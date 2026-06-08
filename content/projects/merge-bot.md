---
title: "merge-bot"
date: 2019-09-20T00:00:00+00:00
description: "GitHub Action for automated PR merging based on labels, blocking labels, and reviewer sign-off."
status: archived
repo: https://github.com/squalrus/merge-bot
# Featured image — shown on the project card and at the top of this page:
image: /img/projects/merge-bot/featured.png
# Gallery — shown when drilling into this project:
# gallery:
#   - src: /img/projects/merge-bot/marketplace.png
#     caption: "GitHub Marketplace listing"
demo: "https://github.com/marketplace/actions/pr-merge-bot"
tech:
  - GitHub Actions
  - TypeScript
  - Node.js
featured: true
terminal:
  label: 'merge-bot — ci'
  glyph: '{ }'
  lines:
    - '$ merge-bot --auto'
    - '# labels ok · blocking: none'
    - '✓ reviewers signed off (2/2)'
    - '✓ merged PR #482 → main'
---

PR management for GitHub repos. merge-bot automates pull request integration by checking a configurable set of conditions before merging: required labels, blocking labels, and optional reviewer approval. Once conditions are met, the PR is merged with the method of your choice and the branch is cleaned up.

It's designed to replace the manual label-watching and back-and-forth of "is this ready?" — wire it up, set your rules, and let the bot handle the rest.

## Why

This came out of a real workflow gap at Microsoft. The team was already using labels to signal when a PR was ready — required labels, blocking labels, reviewer sign-off — but nothing actually pulled the trigger. Someone still had to watch the queue, check the conditions, and click merge. That last mile was manual and annoying.

GitHub Actions were also brand new at the time, which made it a two-for-one: solve the team's problem and figure out what Actions could actually do. Publishing to the Marketplace was the natural next step — if we needed this, other teams did too.

## Setup

Add a workflow file at `.github/workflows/merge-bot.yml`:

```yaml
name: Merge Bot
on:
  pull_request:
    types: [labeled, unlabeled, review_requested, review_request_removed]
  pull_request_review:
jobs:
  merge:
    runs-on: ubuntu-latest
    steps:
    - uses: squalrus/merge-bot@v1
      with:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        labels: ready
        blocking_labels: do not merge
        method: squash
```

## Options

| Option | Default | Description |
|---|---|---|
| `labels` | `ready` | Label(s) required before merging |
| `blocking_labels` | `do not merge` | Label(s) that block the merge |
| `reviewers` | `true` | Require all reviewers to approve |
| `method` | `merge` | Merge method: `merge`, `squash`, or `rebase` |
| `test` | `false` | Test mode — comments instead of merging |
| `delete_source_branch` | `false` | Delete branch after merge |
