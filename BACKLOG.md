# Backlog

Tracks future features, improvements, and known bugs for squalr.us. Items here are not committed work — they're candidates. The shipped trail lives in [CHANGELOG.md](./CHANGELOG.md), versioned by [semver](https://semver.org/).

This file is rendered on the site at [/backlog](https://squalr.us/backlog/) and read directly by Claude when picking up work — it's the single source of truth for "what's next," not a copy of one.

## Shipping a backlog item

When a backlog item lands, run the same checklist every time so the version trail and the changelog stay accurate:

1. **Decide the version, then branch off `main` named for it.** Pick the new version using the semver rules in step 4, then cut a working branch named `vX.Y.Z` off the current `main` — e.g. `git switch -c v1.1.0 main`. All the edits below land on that branch; never commit shipping work straight to `main`.
2. **Move the entry to [CHANGELOG.md](./CHANGELOG.md).** Add a new version block at the top — date it (`YYYY-MM-DD`), classify the change (`Added` / `Changed` / `Fixed` / `Removed`), and write the user-facing summary there. Don't leave a duplicate in this file. **Adding this block _is_ the version bump** — the footer chip and `/changelog` page read the latest version straight from the top of `CHANGELOG.md` at build time, so there is no separate version constant to edit.
3. **Update the docs as needed.** Touch only the files where reality actually changed — don't churn them otherwise. Typical triggers:
   - **CLAUDE.md** — a new layout/template pattern, a new convention (image folders, frontmatter fields), a new gotcha, or invalidation of an existing one.
   - **docs/TECH-STACK-AUDIT.md** — a dependency/version/CI change, or an audit item resolved (tick it off rather than leave it stale).
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

### Bugs

| Title | Effort | Value |
| --- | --- | --- |
| Color contrast failures across cards and badges (a11y) | M | H |

### Features

| Title | Effort | Value |
| --- | --- | --- |
| Scheduled rebuild so future-dated posts auto-publish | S | M |
| CSS-only gallery lightbox | S | M |
| Windows minimize, maximize, and close | M | H |
| AIM-style buddy list widget backed by Steam friends API | M | H |
| Replace fake guestbook with GitHub Discussions (Giscus) | M | M |

### Improvements

| Title | Effort | Value |
| --- | --- | --- |
| Flesh out the `desktop-tracker` project body and screenshots | S | M |
| Serve responsive / optimized images (Glizzy Relay) | M | M |
| Fix forced reflow in cybershack.js | M | M |

### Cleanup

_No open cleanup items._

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

### Windows minimize, maximize, and close

**Type:** feature

**Why:** The Win95-style windows have decorative title bar buttons but they do nothing on click. Making them functional would be on-brand — minimize collapses a window to a taskbar entry, close hides it, maximize fills the viewport — and makes the homepage feel like an actual desktop rather than a static mockup.

**Notes:**

- Keep JS minimal: a small vanilla module that toggles classes. No framework.
- **Minimize:** collapse the window to show only its title bar; add a taskbar entry at the bottom of the screen that restores it on click.
- **Maximize:** expand the window to fill the main content area, storing original dimensions for restore. Double-click on the title bar is the classic trigger.
- **Close:** hide the window entirely; add a way to reopen (a taskbar entry or a clickable "desktop icon").
- Persist state in `sessionStorage` so windows stay closed/minimized across soft navigations but reset on a fresh visit.
- JS goes in `themes/squalr/assets/js/` and is bundled through Hugo Pipes (same pattern as existing scripts).
- Degrade gracefully with no JS — buttons just don't respond, same as today.

---

### Flesh out the `desktop-tracker` project body and screenshots

**Type:** improvement

**Why:** Metadata was updated in v1.3.1 (correct stack, real description, status promoted to `active`) but the detail page still has no body copy and no screenshots. Without them, clicking into the project lands on an empty shell.

**Notes:**

- Add a real body (what the app does, why Virtual Desktop tracking, how the BambooHR sync works) so the detail page isn't empty.
- Add a featured `image:` + a `gallery:` once there are screenshots — drop files in `static/img/projects/desktop-tracker/` (the folder exists).
- Cross-link any future "building desktop-tracker" post via `projects: [desktop-tracker]` so the card's field-note count lights up.

---

### Color contrast failures across cards and badges (a11y)

**Type:** bug

**Why:** Multiple elements fail WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large/bold text). Low-contrast text is difficult or impossible to read for users with low vision or color-vision deficiency.

**Notes:**

- Failing elements identified by Lighthouse:
  - `.wip` badge text (status pill)
  - `.panel` div text
  - `.pnotes.none` span ("◇ no notes yet")
  - `.pcard` article background/foreground
  - `.pstat.archived` badge text
- All styles live in `themes/squalr/assets/css/cybershack.css`. Check each selector's `color` and `background-color` with a contrast checker (browser DevTools has one built in under the color picker).
- The 90s GeoCities aesthetic uses pastels and neons that often fail WCAG — adjust luminance rather than hue to preserve the vibe while hitting contrast ratios.
- `.pnotes.none` is the "no notes yet" placeholder — easiest fix is darkening the text color since the background is already known.
- Badge fixes (`.wip`, `.pstat.archived`): try darkening the text or lightening the background by 10–15% and re-check; small adjustments usually clear the threshold without visible aesthetic change.

---

### Serve responsive / optimized images (Glizzy Relay)

**Type:** improvement

**Why:** The Glizzy Relay featured image is 1920×1070 px (212 KiB) but displayed at 683×384 px, wasting ~185 KiB per page load. Lighthouse flags this as a direct LCP contributor. The same issue likely affects other project featured images.

**Notes:**

- **Quick fix (do first):** resize `static/img/projects/glizzyrelay.com/featured.png` to ≤1366px wide using any image tool, and convert to WebP. Halves the bytes with no template change.
- **Better fix:** use Hugo's built-in image processing in the project card/detail templates — `resources.Get` + `.Resize "683x" webp` generates a correctly-sized WebP at build time. Hugo caches resized images in `resources/_gen/`, which is gitignored.
- **Best fix (stretch):** generate a `srcset` with 2–3 sizes (683w, 1024w, 1366w) so mobile gets the smallest version. Hugo's `.Resize` and `.Fill` support this with a `range` loop.
- Audit all other files under `static/img/projects/` for the same oversize pattern while you're here — fix them all in one pass.
- Update CLAUDE.md's image section to document the max source image width convention once a standard is set.

---

### Fix forced reflow in cybershack.js

**Type:** improvement

**Why:** Lighthouse flags 182ms of unattributed forced reflow — JavaScript is querying layout properties (e.g. `offsetWidth`) after invalidating the DOM, forcing the browser to synchronously recalculate styles. This blocks the main thread and delays interactivity.

**Notes:**

- Open Chrome DevTools → Performance tab → record a page load → look for tall "Recalculate Style" / "Layout" blocks triggered immediately after JS execution. The call stack will point at the offending line in `cybershack.js`.
- Classic pattern to look for: a DOM write (setting `innerHTML`, toggling a class, changing a style) followed immediately by a geometry read (`offsetWidth`, `getBoundingClientRect`, `scrollHeight`). The read forces a flush.
- Likely suspects: the visitor counter (updates text then reads width?), the Now Playing widget (sets album art then reads container size?), or the sparkle cursor (measures cursor position relative to DOM on mousemove).
- Fix: batch all reads before writes, or defer the write to the next `requestAnimationFrame`. A pattern like `requestAnimationFrame(() => { el.style.width = ...; })` breaks the read-write cycle.
- "Unattributed" in Lighthouse means it may originate in a third-party script (GTM) — profile with GTM blocked to isolate whether the reflow is first- or third-party.

---

### AIM-style buddy list widget backed by Steam friends API

**Type:** feature

**Why:** The 90s GeoCities theme is strongest when it feels lived-in. A real AIM-style buddy list showing actual Steam friends online/offline/in-game would make the homepage feel like a genuine throwback desktop rather than a CSS exercise. Steam's public Web API makes this possible without any auth flow from visitors.

**Notes:**

- **Widget concept:** A draggable (or fixed) "Buddy List" window — title bar reads "Buddy List", rows grouped by "Online" / "Away" / "Offline", each entry shows a friend's Steam display name and a coloured AIM-style status dot.
- **Steam Web API is the right backend:**
  - `GET https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=KEY&steamid=STEAMID&relationship=friend` returns friend SteamIDs.
  - A second call to `GetPlayerSummaries` fetches display names, avatars, and `personastate` (0 = offline, 1 = online, 2 = busy, 3 = away, 4 = snooze, 5 = looking to trade, 6 = looking to play).
  - Your Steam profile must be set to **Public** for the friend list to be readable.
  - API key is free at `https://steamcommunity.com/dev/apikey` — store it in Azure Static Web Apps application settings and proxy the call through a small Azure Function or API route so the key is never in the client bundle.
  - Rate limit: 100,000 calls/day — well within range for a personal site.
- **Why not Xbox or Discord:** Xbox's friends API requires per-visitor OAuth. Discord's API also requires OAuth. Last.fm has a friends endpoint but the social graph there is low-activity. Steam is the clear choice.
- **AIM visual fidelity:** Classic AIM color scheme (white bg, yellow/blue accents, running-man favicon). The window can share drag logic with the Win95 windows item.
- The static AIM username display (shipped in v1.3.4) is the MVP; this widget is the deluxe version.

---

### Replace fake guestbook with GitHub Discussions (Giscus)

**Type:** feature

**Why:** The current guestbook is `localStorage`-backed — each visitor sees only their own entries, nobody else's. It reads as a placeholder. Replacing it with a real commenting system backed by a public platform gives visitors an actual social touchpoint and makes the page feel alive.

**Notes:**

- **Recommended: Giscus** (`giscus.app`) — open source, zero ads, no tracking beyond GitHub, uses GitHub Discussions as the storage backend. Visitors need a GitHub account to post; that's a reasonable bar for a developer-audience site.
  - Enable GitHub Discussions on this repo, create a "Guestbook" category.
  - Generate the embed snippet at `giscus.app` (choose repo, category, theme). It produces a `<script>` tag to drop into the guestbook partial or directly in `index.html`.
  - Theme it to match the 90s aesthetic: Giscus accepts a `data-theme` URL pointing at a custom CSS file — wire up a Win95-style sheet to make comments feel native to the site.
- **Alternative: GitHub Issues as guestbook.** One pinned Issue = the guestbook thread. `GET /repos/{owner}/{repo}/issues/{n}/comments` returns replies; render them client-side for full control, more code.
- **Not recommended:** LinkedIn has no public embeddable API. Twitter/X API is now paywalled. Disqus is free but ad-supported and adds tracking. Utterances is similar to Giscus but uses Issues (less semantic for a guestbook).
- When Giscus is wired up, strip the fake guestbook logic from `cybershack.js` to avoid confusion and reduce the bundle.

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
