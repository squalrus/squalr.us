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
| Now Playing `<img>` missing `src`/`srcset` (HTML validator) | S | M |
| Color contrast failures across cards and badges (a11y) | M | H |

### Features

| Title | Effort | Value |
| --- | --- | --- |
| Scheduled rebuild so future-dated posts auto-publish | S | M |
| CSS-only gallery lightbox | S | M |
| Windows minimize, maximize, and close | M | H |

### Improvements

| Title | Effort | Value |
| --- | --- | --- |
| Flesh out the `desktop-tracker` project body and screenshots | S | M |
| Add preconnect hints for Last.fm and audioscrobbler | S | M |
| Explicit width and height on Now Playing album art | S | M |
| Defer cybershack.js from critical render path | S | M |
| Defer Google Tag Manager loading | S | M |
| Serve responsive / optimized images (Glizzy Relay) | M | M |
| Fix forced reflow in cybershack.js | M | M |

### Cleanup

| Title | Effort | Value |
| --- | --- | --- |
| Drop "web ring" concept | S | M |
| Audit and normalize blog post tags | S | M |

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

### Audit and normalize blog post tags

**Type:** cleanup

**Why:** Blog tags were added ad-hoc across posts without a controlled vocabulary. The `/tags/` page has one-offs that won't get a second post, near-duplicates (e.g. `azure` vs `Azure`), and overlapping concepts that fragment discovery. A one-time audit deduplicates and merges them so the taxonomy is actually useful for browsing.

**Notes:**

- Browse `/tags/` (or `hugo list all` output) to enumerate every current tag and its count.
- Flag: tags with a count of 1 that are too specific to recur, semantic near-duplicates, tags that are too broad to be useful as a filter.
- Fix by editing the `tags:` frontmatter on affected posts in `content/blog/` — no template changes.
- Once settled, record the canonical tag vocabulary in CLAUDE.md so new posts stay within it.

---

### Drop "web ring" concept

**Type:** cleanup

**Why:** The web ring section is a fun nod to the 90s but it's not connected to an actual web ring and has no real outbound links. It reads as an empty placeholder that dilutes the page rather than adding personality.

**Notes:**

- Remove the web ring section from the homepage layout (`themes/squalr/layouts/index.html` or the relevant partial).
- Remove any CSS scoped to `.webring` or similar from `cybershack.css`.
- Don't leave a commented-out skeleton — if the concept ever comes back with real members and links, it's easy to add fresh.

---

### Now Playing `<img>` missing `src`/`srcset` (HTML validator)

**Type:** bug

**Why:** Removing the empty `src=""` attribute (v1.3.1) fixed the spurious network request, but left `<img id="np-art" alt hidden>` with neither `src` nor `srcset`. The HTML spec requires at least one of these on every `<img>` — the W3C validator flags it as an error, and some browsers may render a broken-image icon before JS hides the element.

**Notes:**

- Validator error: `Element img is missing one or more of the following attributes: src, srcset.` at `<img id=np-art alt hidden>` in `themes/squalr/layouts/index.html`.
- Fix: set `src` to a 1×1 transparent data URI so the element is valid HTML and makes no network request:

  ```html
  <img id="np-art" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" hidden>
  ```

- The JS in `cybershack.js` already overwrites `img.src` with the real album-art URL when a track is found, so the placeholder is only ever visible to the validator (the element stays `hidden` until JS reveals it).
- Pair with the "Explicit width and height on Now Playing album art" improvement when touching this element — both are one-line changes on the same `<img>`.

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

### Add preconnect hints for Last.fm and audioscrobbler

**Type:** improvement

**Why:** Lighthouse estimates 330ms LCP savings from preconnecting to `https://lastfm.freetls.fastly.net` and 200ms from `https://ws.audioscrobbler.com`. These origins serve the Now Playing widget's album art and API data. Adding `<link rel="preconnect">` lets the browser start DNS/TLS handshakes before the JS fires the requests.

**Notes:**

- Add to the `<head>` in `themes/squalr/layouts/index.html` (homepage only — that's where Now Playing lives):

  ```html
  <link rel="preconnect" href="https://lastfm.freetls.fastly.net" crossorigin>
  <link rel="preconnect" href="https://ws.audioscrobbler.com">
  ```

- Keep total preconnect hints to ≤4 per Lighthouse guidance. These two are the highest-value targets.
- Pair with deferring `cybershack.js` (see separate item) for cumulative LCP improvement — preconnect only helps if the fetch itself isn't also blocked by a render-blocking script.
- The `crossorigin` attribute is needed for `lastfm.freetls.fastly.net` because the `<img>` fetch is CORS; omit it for the audioscrobbler XHR (same-origin CORS semantics differ).

---

### Explicit width and height on Now Playing album art

**Type:** improvement

**Why:** The Last.fm album art `<img id="np-art">` has no explicit `width` or `height` attributes, so the browser can't reserve space for it before the image loads. This causes layout shift (CLS) — surrounding content jumps when the image arrives.

**Notes:**

- The image is fetched dynamically from Last.fm's CDN at 300×300 resolution.
- Add `width="300" height="300"` to the `<img id="np-art">` element — either in the template where it's declared or in the JS where the element is created/populated in `themes/squalr/static/cybershack.js`.
- CSS can still override the displayed size; the attributes just give the browser an aspect ratio to hold space with.
- If the Now Playing widget is hidden when no track is playing, the reserved space disappears anyway — confirm the hiding/showing logic doesn't itself cause layout shift.

---

### Defer cybershack.js from critical render path

**Type:** improvement

**Why:** `cybershack.js` (4.6 KiB) blocks the page's initial render for ~540ms. None of the features it provides (visitor counter, sparkle cursor, Now Playing) are needed for above-the-fold paint — deferring it moves it off the critical path and improves LCP and FCP.

**Notes:**

- Add `defer` to the `<script>` tag that loads `cybershack.js` in `themes/squalr/layouts/index.html` and `_default/baseof.html`.
- `defer` is safe as long as no other inline script in the document depends on `cybershack.js` executing synchronously. Check for any inline `<script>` that calls functions from `cybershack.js` — if found, either also defer those or fold them into the file.
- The script should already be wrapping DOM-dependent code in a `DOMContentLoaded` listener (or equivalent). If it isn't, the defer attribute will shift when the code runs — audit and fix the listener pattern at the same time.
- Preconnect hints for Last.fm (see separate item) compound this improvement: with the script deferred, the browser can start the Last.fm connection earlier relative to page load.

---

### Defer Google Tag Manager loading

**Type:** improvement

**Why:** GTM loads 143 KiB on every page, with 83 KiB unused on initial load. Analytics don't need to fire during the critical render path — deferring or async-loading GTM has no user-visible impact and reduces bytes consumed on first paint.

**Notes:**

- GTM's standard snippet already uses an async pattern for the main `gtm.js` library, but the inline snippet itself can still block if it's synchronous.
- Check the GTM snippet in the templates — if it's a raw `<script>` block without `async` or `defer`, that's the blocker. Adding `defer` to the script tag (or restructuring to use GTM's recommended async snippet) is the fix.
- If the inline GTM snippet is also the source of the CSP hash violation (see bug item), moving it to an external file solves both issues at once.
- Confirm GA4 events still fire correctly after the change — test with GTM's preview mode and the GA4 DebugView.

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
