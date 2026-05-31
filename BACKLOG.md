# Backlog

Tracks future features, improvements, and known bugs for squalr.us. Items here are not committed work — they're candidates. The shipped trail lives in [CHANGELOG.md](./CHANGELOG.md), versioned by [semver](https://semver.org/).

This file is rendered on the site at [/backlog](https://squalr.us/backlog/) and read directly by Claude when picking up work — it's the single source of truth for "what's next," not a copy of one.

## Shipping a backlog item

When a backlog item lands, run the same checklist every time so the version trail and the changelog stay accurate:

1. **Decide the version, then branch off `main` named for it.** Pick the new version using the semver rules in step 4, then cut a working branch named `vX.Y.Z` off the current `main` — e.g. `git switch -c v1.1.0 main`. All the edits below land on that branch; never commit shipping work straight to `main`.
2. **Move the entry to [CHANGELOG.md](./CHANGELOG.md).** Add a new version block at the top — date it (`YYYY-MM-DD`), classify the change (`Added` / `Changed` / `Fixed` / `Removed`), and write the user-facing summary there. Don't leave a duplicate in this file. **Adding this block _is_ the version bump** — the footer chip and `/changelog` page read the latest version straight from the top of `CHANGELOG.md` at build time, so there is no separate version constant to edit.
3. **Update the docs as needed.** Touch only the files where reality actually changed — don't churn them otherwise. Typical triggers:
   - **CLAUDE.md** — a new layout/template pattern, a new convention (image folders, frontmatter fields), a new gotcha, or invalidation of an existing one.
   - **TECH-STACK-AUDIT.md** — a dependency/version/CI change, or an audit item resolved (tick it off rather than leave it stale).
   - **A blog post** — only if the change is itself worth writing about (this is a blog; shipping notes ≠ posts).
4. **Pick the new version by [semver](https://semver.org/):**
   - `feature` → minor bump (e.g. `1.0.1` → `1.1.0`)
   - `bug` / `improvement` / `cleanup` / `known issue` (if it actually shipped) → patch bump (e.g. `1.0.0` → `1.0.1`)
   - breaking change (URL structure, feed format, removing a page) → major bump
   - Reset the lower segments on a higher bump (a minor bump zeroes the patch).
5. **Remove the row from its type table** in the Suggested execution order section below, and delete its detail block from Open. No global renumbering — within-type ordering communicates "do this next".
6. **Build as the correctness gate.** Run `hugo --minify` with Dart Sass on `PATH` (see [CLAUDE.md](./CLAUDE.md)). It must exit clean — a broken SCSS pipeline or template error fails here, not in CI.
7. **Commit, push the branch, open a PR.** The PR gets an Azure preview deployment (staging URL posted as a comment) — eyeball it. The agent's job ends at "PR opened with a clean build"; you review the preview and merge the PR yourself. Merging to `main` triggers the production deploy. (Merging is the human review gate — keep it manual.)

Format per item:

- **Title** — one-line summary
- **Type**: feature / improvement / bug / cleanup / known issue
- **Why** — what problem this solves or value it adds
- **Notes** — implementation hints, dependencies, open questions

---

## Suggested execution order

Grouped by type; within each type sorted by ROI — small/high first, large/low last.

- **Effort** — rough Claude session cost. **S** = a single focused turn (one or two files, no clarification needed). **M** = a conversation session (several files, maybe a question or two upfront, fits one context window). **L** = multi-session work that warrants a written plan first.
- **Value** — impact on a reader/visitor. **H** = clearly noticeable or removes real friction. **M** = a solid improvement, narrower audience. **L** = polish or quiet upkeep.

### Features

| Title | Effort | Value |
| --- | --- | --- |
| Scheduled rebuild so future-dated posts auto-publish | S | M |
| CSS-only gallery lightbox | S | M |

### Improvements

| Title | Effort | Value |
| --- | --- | --- |
| Self-host the three web fonts (drop the Google Fonts dependency) | S | M |
| Flesh out the `desktop-tracker` project metadata | S | L |
| Drop OpenSea from the CSP + note the defunct embeds in the NFT post | S | M |
| Update the Twitter social link to X | S | L |
| Migrate SCSS `@import` → `@use` / `@forward` | M | M |
| TODO: review all blogs tags | | |

---

## Open

### Scheduled rebuild so future-dated posts auto-publish

**Type:** feature

**Why:** Future-dated posts don't go live on their own. Hugo hides future content by default (`buildFuture` is unset → `false`), and the site only rebuilds on `push` / `pull_request` — there's no cron — so even after a post's date passes, nothing republishes until the next manual push. Setting a publish date and walking away doesn't work today; you have to push something on/after the date. A scheduled rebuild closes that gap.

**Notes:**

- Add a `schedule` trigger to `.github/workflows/azure-static-web-apps-blue-plant-0a72bd81e.yml` alongside the existing `push` / `pull_request`:

  ```yaml
  on:
    push:
      branches: [main]
    pull_request:
      types: [opened, synchronize, reopened, closed]
      branches: [main]
    schedule:
      - cron: '0 13 * * *'   # daily 13:00 UTC; posts publish within ~24h of their date
  ```

- The build/deploy job's `if:` currently gates on `push` / `pull_request` only — widen it so the `schedule` event also runs the build+deploy job (e.g. add `|| github.event_name == 'schedule'`). The close-PR job stays `pull_request`-only.
- Keep `buildFuture` **false** — that's the point (future posts stay hidden until their date passes, then a scheduled build picks them up). Don't set `buildFuture: true`, which would publish them immediately.
- Tradeoff: a daily cron means up to ~24h latency between the post's date and it going live; tighten the cron if you want finer granularity. Note GitHub's scheduled workflows can be delayed under load and are disabled after 60 days of repo inactivity.
- Document the "set a future `date`, it publishes on the next scheduled build" behavior in CLAUDE.md's posting section when this ships.

---

### CSS-only gallery lightbox

**Type:** feature

**Why:** Project galleries currently open each screenshot full-size in a new browser tab (a plain `<a target="_blank">`). That works and stays zero-JS, but it kicks the visitor out of the page. A lightbox — click a thumbnail, it opens in an overlay, click away to close — keeps them in flow and reads more like a real project showcase.

**Notes:**

- Keep it zero-JS. The `:target` pseudo-class lightbox pattern works: each gallery image links to `#img-<n>`, a sibling overlay element matches `:target` and shows via CSS, and a full-cover close link resets the hash. Hugo can generate the IDs in the `range` loop in `themes/squalr/layouts/projects/single.html`.
- Respect `prefers-reduced-motion` for the fade.
- Trap: `:target` lightboxes can fight the browser back button and scroll position. Test that closing returns the visitor to where they were on the page.
- If `:target` gets fiddly, a tiny vanilla-JS lightbox (no dependency) is the fallback — but try CSS first to keep the no-build ethos.

---

### Self-host the three web fonts (drop the Google Fonts dependency)

**Type:** improvement

**Why:** The cyberpunk redesign loads Press Start 2P, Space Grotesk, and JetBrains Mono from Google Fonts, which added `fonts.googleapis.com` / `fonts.gstatic.com` to the CSP and a third-party request to the critical path. The site otherwise prides itself on zero external deps and an A+ security posture — self-hosting the fonts gets both back and removes a render-blocking cross-origin hop.

**Notes:**

- Download the woff2 files (subset to latin), drop them in `themes/squalr/static/fonts/` (or `assets/`), and add `@font-face` rules with `font-display: swap` to `_base.scss`.
- Remove the Google Fonts `<link>` + preconnects from `baseof.html`, and drop `https://fonts.googleapis.com` / `font-src https://fonts.gstatic.com` from the CSP in `static/staticwebapp.config.json`.
- Press Start 2P is pixel/bitmap-ish and only used at a couple of sizes — a tight latin subset keeps it small.
- Verify the A+ security headers score and that the arcade hero/headers still render identically.

---

### Drop OpenSea from the CSP + note the defunct embeds in the NFT post

**Type:** improvement

**Why:** The "WTF is NFT" post used to embed `<nft-card>` web components that are long dead (OpenSea changed their API; the `embeddable-nfts` package is unmaintained). The broken embeds have been stripped from the post, but `staticwebapp.config.json` still allows `https://api.opensea.io` in the CSP for them — dead allowance widening the policy surface for no reason. The post would also read better with an honest one-liner that the live cards are gone.

**Notes:**

- Remove the OpenSea entries from the CSP `connect-src` / `script-src` in `static/staticwebapp.config.json`. Confirm nothing else on the site still calls OpenSea first (it doesn't).
- Add a short blockquote/aside to `content/blog/wtf-is-nft.md` acknowledging the embeds were retired — matches the writing-style guide's "acknowledge tradeoffs honestly".
- Verify the A+ security headers score is unchanged (ideally improved) after the CSP trim.

---

### Update the Twitter social link to X

**Type:** improvement

**Why:** `config.yaml` links the social icon to `https://x.com/chadschulz` already, but the icon key is still `twitter` and any lingering `twitter.com` references should resolve to the current brand. Low urgency, pure consistency.

**Notes:**

- Audit `config.yaml` `params.social` and the icon data (`themes/squalr/data/squalr/icons`) for `twitter` vs `x` naming.
- If the icon glyph is the old Twitter bird, swap it for the X mark while here.
- Cosmetic only — no behavior change, hence Value: L.

---

### Migrate SCSS `@import` → `@use` / `@forward`

**Type:** improvement

**Why:** Dart Sass deprecated `@import` rules; they'll be removed in Dart Sass 3.0.0. The build currently runs Dart Sass 1.100.0, where `@import` still works but emits a deprecation warning on every build.

**Notes:**

- **Where:** `themes/squalr/assets/css/main.scss` imports `base`, `extra`, and the `components/*` partials via `@import`.
- **Catch:** The partials rely on globally-scoped variables (`$darkest-color`, `$primary-color`, etc.) defined at the top of `main.scss`. `@use` namespaces members per-module, so a naive swap breaks those references. The migration needs restructuring — move the variables into a module the partials `@use` (or `@forward`), or pull them in with `@use '...' as *`. Diff the compiled CSS before/after to confirm no visual regressions.
- **When:** before upgrading to Dart Sass 3.0.0 (not yet released). Not urgent, but it's the last deprecation warning in the build.

---

### Flesh out the `desktop-tracker` project metadata

**Type:** improvement

**Why:** `content/projects/desktop-tracker.md` is the thinnest project — a one-line description, `Rust` / `Tauri` tech, and a faux-terminal banner, but no real body, no screenshots, and no detail worth landing on. It reads as a placeholder. Once the project has something to show, give it the metadata the card + detail page are built to display.

**Notes:**

- Add a real body (what it does, why local-first, the "watch what I'm actually doing" angle) so the detail page isn't empty.
- Add a featured `image:` + a `gallery:` once there are screenshots — drop files in `static/img/projects/desktop-tracker/` (the folder exists).
- Tighten `tech:` if the stack firms up, and flip `status:` off `wip` when it's real.
- Cross-link any future "building desktop-tracker" post via `projects: [desktop-tracker]` so the card's field-note count lights up.

---

## Content queue

Drafted / scheduled posts, with their intended go-live dates. Future-dated posts stay hidden until their date passes **and** a build runs after it (see [Scheduled rebuild so future-dated posts auto-publish](#scheduled-rebuild-so-future-dated-posts-auto-publish) — until that ships, publishing one means pushing a commit on/after its date). Titles are intentionally visible here — call it a teaser.

| Post | Go-live | Status |
| --- | --- | --- |
| Still Here. New Chapter. | 2026-06-02 | draft — **needs Chad's review** (personal details / Dura specifics are placeholders) |
| Modernizing My Hugo Blog in 2026 | 2026-06-04 | queued — the `v1.0.0` explainer |
| The three markdown files that replaced my project tools | 2026-06-09 | queued — ready |
| Building a Custom Hugo Theme | 2026-06-11 | queued — ready |

## Shipped

Shipped items live in [CHANGELOG.md](./CHANGELOG.md), versioned by semver. See [Shipping a backlog item](#shipping-a-backlog-item) above for the migration steps.
