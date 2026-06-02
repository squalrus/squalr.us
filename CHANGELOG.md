# Changelog

User-visible changes to squalr.us, newest first. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the site uses [semver](https://semver.org/) — see [BACKLOG.md](./BACKLOG.md#shipping-a-backlog-item) for how each backlog item gets versioned and migrated here.

## [1.3.5] — 2026-06-01

### Removed

- **Web ring widget dropped.** The "Static-Site Ring" sidebar panel was a placeholder with no real outbound links; removed from `index.html` and its scoped `.webring` CSS removed from `cybershack.css`.

### Changed

- **Blog tag vocabulary normalized.** Audited all post frontmatter — deduped near-duplicates, removed the vague `project` tag, merged `cryptocurrency` + `nft` → `web3`, renamed `github` → `automation`, added `documentation` to the documentation post, and tagged the previously tag-less 11ty deploy post (`azure`, `website`). Canonical vocabulary recorded in `CLAUDE.md`.

## [1.3.4] — 2026-06-01

### Fixed

- **Now Playing `<img>` validates cleanly.** Added a 1×1 transparent GIF data URI as the placeholder `src` and explicit `width="300" height="300"` attributes. The element is now spec-valid, the browser can reserve layout space to prevent CLS, and no network request is made until JS populates the real album-art URL. (`index.html`)

### Added

- **Connect section: AIM handle and email.** `Squalrus19` (AIM) and an email link now appear in the Connect panel beneath the social icons. (`index.html`)

### Changed

- **Sidebar stacks first on mobile.** Removed the `order: 2` override that was pushing the sidebar (visitor counter, Now Playing, Connect) below the main content and footer on narrow screens. Sidebar now flows at the top on mobile, above the projects and posts grid. (`cybershack.css`)
- **Preconnect hints for Last.fm.** Added `<link rel="preconnect">` hints for `lastfm.freetls.fastly.net` (with `crossorigin`) and `ws.audioscrobbler.com` — Lighthouse-estimated 330ms + 200ms LCP savings for the Now Playing widget. (`index.html`)
- **`cybershack.js` deferred.** Added `defer` to the `<script>` tag in both `index.html` and `baseof.html`, moving the 4.6 KiB script off the critical render path (~540ms FCP/LCP improvement). `defer` guarantees DOM-ready execution so no listener-pattern changes were needed.
- **Google Analytics moved out of `<head>`.** The GA/gtag snippet is now emitted at the bottom of `<body>` in both templates, pushing its inline initialization script out of the critical path. The main `gtag.js` file was already `async`; this removes it from the head entirely. CSP hash unchanged. (`index.html`, `baseof.html`)

---

## [1.3.3] — 2026-06-01

### Changed

- **Blog added to main nav.** "Blog" now appears between Home and Projects in the nav row on every page. (`config.yaml`)
- **Projects sorted by date, weight removed.** Cards on the homepage and `/projects/` list are now sorted newest-first by frontmatter `date`. The manual `weight:` field is removed from all project files. (`index.html`, `projects/list.html`, project frontmatter)
- **WinAmp scroll animation.** The previous keyframe held the text fully off-screen for 20% of the loop (blank LCD visible). The scroll now runs from 20% to 100%, snapping back at the loop point while the text is already off-screen — invisible jump, clean loop. Duration divisor updated to match (80% scroll / 20% hold). (`cybershack.css`, `cybershack.js`)
- **WinAmp edge fades gated on scrolling.** The `::before`/`::after` fade-to-black gradients on `.wa-clip` are now scoped to `:has(.wa-scrolling)` — they only appear when text is actively scrolling. Short titles like "Ciel" were being clipped by the always-on left gradient; now they display cleanly. (`cybershack.css`)
- **WinAmp album art fills widget on mobile.** Added `width:100%` to `#np-art` so the album art stretches to match the full-width widget on mobile instead of rendering at its natural 300px with background showing beside it. (`cybershack.css`)

---

## [1.3.2] — 2026-06-01

### Changed

- **CRT effect on project screenshots and terminal blocks.** A CSS `::after` overlay adds authentic scanlines (`repeating-linear-gradient`) and a vignette (`box-shadow: inset`) to `.shot` card thumbnails and `.project-hero-media` detail images. A subtle flicker animation is applied to the overlay and respects `prefers-reduced-motion`. Terminal block text gets a phosphor glow (`text-shadow`) on the green and cyan colors. (`cybershack.css`)
- **Project card title links readable.** Card title `<a>` inside `.pchrome` now overrides the global blue link color with white to match the purple gradient title bar. No underline at rest; underline appears on hover along with a translucent white wash. (`cybershack.css`)
- **Project card hover state.** Cards now shift border to magenta and gain a subtle purple drop shadow on hover — making the card-as-link intent obvious without requiring a cursor-pointer override. (`cybershack.css`)
- **`.pnotes.none` contrast fix.** "◇ no notes yet" was rendered with `opacity: .55` (~2.8:1 contrast against cream background, failing WCAG AA). Replaced with an explicit `color: #6b5d8f` (~5.4:1). (`cybershack.css`)
- **Glizzy Relay frontmatter.** Switched from a custom `links:` entry to the semantic `demo:` field; harmonized `demo` label to `live↗` on the detail page to match the card. (`content/projects/glizzyrelay.com.md`, `themes/squalr/layouts/projects/single.html`)

---

## [1.3.1] — 2026-06-01

### Fixed

- **CSP inline-script hash updated.** Hugo 0.162's `_internal/google_analytics.html` emits a DNT-aware variant of the gtag initializer — the old hash no longer matched, silently blocking analytics. Hash replaced with the correct SHA-256 for the current output. (`staticwebapp.config.json`)
- **Mobile viewport overflow.** Added `html { overflow-x: hidden }` alongside the existing `body` rule. Without it, some Android Chrome builds promote `html` to the scroll container and evaluate media-query widths against the document layout width rather than the device viewport — causing the 760 px breakpoint to never fire on phones. (`cybershack.css`)
- **`aria-label` on unlabelled `<div>` elements.** The Now Playing widget wrapper (`<div class="wa">`) and the guestbook list (`<div id="gb-list">`) both carried `aria-label` with no `role`, making the label invisible to assistive technology. Added `role="region"` to both. (`index.html`)
- **Now Playing album art — empty `src` attribute.** `<img id="np-art" src="">` issued a spurious network request to the page URL on load. Removed the empty `src`; the JS sets `img.src` when real album art is available. (`index.html`)
- **Project cards missing heading element.** Each `<article class="pcard">` had no `<h*>` inside it, making card boundaries unlabelled for screen readers. The project title `<span>` is now an `<h3>`, which sits correctly under the section's `<h2>`. CSS reset added to suppress default heading margin. (`pcard.html`, `cybershack.css`)
- **Heading order — h1 → h3 skip.** Five sidebar panel headings were `<h3>` with no `<h2>` between them and the page `<h1>`, creating a gap that breaks screen-reader navigation. Promoted all five to `<h2>`. The same skip existed in related-projects, project gallery, and field-notes sections across detail-page layouts — fixed those too. (`index.html`, `pcard.html`, `related-projects.html`, `projects/single.html`, `cybershack.css`)

### Changed

- **Desktop Tracker project metadata.** Title cased, description updated to reflect the real product (Windows tray app, Virtual Desktop time tracking, BambooHR sync), tech stack corrected to Python / JavaScript / SVG / PyInstaller / BambooHR API, status promoted to `active`. (`content/projects/desktop-tracker.md`)
- **CLAUDE.md frontmatter docs.** `date` and `description` fields in the "Adding a Project" example now include inline comments and real-format examples matching existing projects. (`CLAUDE.md`)

---

## [1.3.0] — 2026-06-01

### Changed

- **Self-hosted web fonts.** Press Start 2P, VT323, and Comic Neue are now served from `/fonts/` rather than Google Fonts. Removes the cross-origin request from the critical path and drops `fonts.googleapis.com` / `fonts.gstatic.com` from the CSP. (`cybershack.css`, `index.html`, `baseof.html`, `staticwebapp.config.json`)
- **Social icons.** GitHub, Twitter, and LinkedIn icons now appear in a Connect panel in the sidebar — inline SVG, zero external deps, neon palette on hover. (`index.html`, `cybershack.css`)
- **Configurable 88×31 badges.** Badge definitions moved to `data/badges.yaml` — add, remove, or reorder badges without touching templates. An `enabled:` flag lets you soft-hide a badge without deleting it. (`data/badges.yaml`, `index.html`)
- **Badge accessibility.** Hugo badge contrast fixed (was 3.3:1, now 7:1+ on deep magenta `#b5006a`). Award badge contrast fixed (was 4.1:1, now 6.6:1 on darker green `#145214`). "100% HAND-CODED" badge replaced with "valid CSS 3" linking to the W3C CSS Validator. (`cybershack.css`, `data/badges.yaml`)
- **"Field Notes" renamed to "Posts"** on the homepage section header. (`index.html`)
- **Reduced-motion coverage tightened.** WinAmp LCD scroll (`wa-scroll.wa-scrolling`) now stops under `prefers-reduced-motion: reduce` — both in CSS (added higher-specificity selector to the `animation:none` block) and in JS (scroll class skipped when motion is reduced). (`cybershack.css`, `cybershack.js`)

---

## [1.2.2] — 2026-06-01

### Changed

- **Mobile support pass.** The site now renders cleanly on 360–414px phone widths. Page edge padding tightened. Win95 window body padding reduced on narrow viewports. Nav buttons, pagination links, and guestbook submit get `min-height:44px` so they meet the 44px touch-target floor; guestbook text inputs grow to match. Post-list rows get `flex-wrap:wrap` so dates don't crush long titles. Status-list items are allowed to wrap. `pre` blocks pick up `-webkit-overflow-scrolling:touch` for iOS momentum scroll; tables use `display:block;overflow-x:auto` so wide tables scroll in-place rather than blowing out the viewport. Sparkle cursor is skipped entirely on coarse-pointer (touch) devices — no mouse, no trail. (`cybershack.css`, `cybershack.js`)

---

## [1.2.1] — 2026-06-01

### Changed

- **Accessibility pass (a11y).** Skip-to-main-content link on every page. Marquee, decorative title-bar chrome, badge wall, webring, flames, and sparkle cursor trail are all `aria-hidden`. `<nav>` with `aria-label` replaces the plain `<div class="navrow">`. `aria-current="page"` on the active nav link. WinAmp transport buttons removed from tab order. Guestbook inputs get real `<label>` elements (`.sr-only`). Visitor counter has an accessible `role="img"` label. Guestbook list and count are `aria-live="polite"`. WinAmp LCD is `aria-live` so now-playing updates announce to screen readers. Section stickers promoted from `<span>` to `<h2>`. Odometer roll animation skipped under `prefers-reduced-motion`. (`index.html`, `baseof.html`, `cybershack.css`, `cybershack.js`)
- **Text contrast.** `--neon` darkened `#00a619` → `#007a14` and `--neon-2` darkened `#008b8b` → `#006e6e` — both now pass WCAG AA on cream and as white-text backgrounds. WinAmp artist color fixed from near-invisible `#005500` on black to readable `#50c050`. (`cybershack.css`)
- **Focus styles.** Global `:focus-visible` ring (yellow outline) for keyboard navigation. (`cybershack.css`)
- **Copy rewrite.** Welcome paragraph now introduces Chad by name and links [Dura Digital](https://duradigital.com). Hero tag links Dura Digital. Status panel adds "at Dura Digital" and drops the redundant post count. Footer drops the placeholder static-site-ring link; closing line simplified. (`index.html`, `baseof.html`)

---

## [1.2.0] — 2026-06-01

### Added

- **Now-playing in the marquee bar.** Both the homepage and inner-page marquees now show the live track from Last.fm — `▶ Song — Artist` while playing, `■ Song — Artist` when idle. Updates every 30 seconds alongside the WinAmp widget. (`cybershack.js`, `index.html`, `baseof.html`)

### Fixed

- **Last.fm fetch unblocked by CSP.** `https://ws.audioscrobbler.com` was missing from the `connect-src` directive, silently killing every now-playing fetch in the browser. Also added `https://lastfm.freetls.fastly.net` to `img-src` so album art loads without a CSP violation. (`staticwebapp.config.json`)

---

## [1.1.0] — 2026-06-01

### Added

- **Live "Now Spinning" powered by Last.fm.** The sidebar widget now fetches real listening data every 30 seconds — track name, artist, and album art. Shows `▶ playing` when something is actively playing, `■ last played` when idle. Spectrum bars drop flat when nothing is playing; falls back silently if the fetch fails. (`cybershack.js`, `index.html`)
- **WinAmp 2.x skin for the now-playing widget.** The old static widget is reskinned as a WinAmp-style player: Win95 blue gradient title bar, black LCD with green phosphor text and an adaptive marquee (only scrolls when the title overflows), an 18-bar spectrum analyzer with staggered per-bar delays, beveled transport controls, and a decorative volume slider. (`cybershack.css`, `index.html`)

---

## [1.0.0] — 2026-05-30

The first versioned release — a years-overdue modernization, a full **90s GeoCities** redesign, and the backlog / changelog / versioning workflow the site now runs on. The [story is its own blog post](/2026/06/modernizing-my-hugo-blog-in-2026/).

### Added

- **90s GeoCities redesign, site-wide.** A light, period-accurate Web 1.0 tribute: tiled confetti wallpaper, Win95 window chrome with title bars, a scrolling marquee, a WordArt rainbow wordmark, 88×31 web badges, a webring, candy-stripe rules, and a custom pixel cursor. The homepage is the full "Cyber-Shack"; every inner page (posts, projects, changelog, backlog, tags) wraps its content in a Win95 window. Blog posts and project pages keep **readable Times-serif body text on cream** so the reading never suffers for the bit. (`themes/squalr/`)
- **Working visitor counter, guestbook, and cursor trail.** Client-side, static-host-friendly (`/cybershack.js`): an animated visitor odometer, a sign-able guestbook, a sparkle cursor trail, and a rotating "Now Spinning" prog-metal widget. The counter and guestbook persist per-browser via `localStorage` — a tribute, not a server.
- **Project showcase.** Projects render as cards with a real screenshot banner or an auto-generated DOS-terminal banner (from a `terminal:` frontmatter block), color-coded status, tags, links, and `◇ N field notes` cross-links to related posts. Detail pages support a featured image + a captioned gallery.
- **Configurable hero.** The wordmark's lit word, kicker, and the sidebar stats come from `config.yaml` (`params.hero`) — wrap a word in `{braces}` to make it the rainbow word.
- **Public changelog + backlog + a version.** [/changelog](/changelog/) and [/backlog](/backlog/) render straight from the root `CHANGELOG.md` / `BACKLOG.md` at build time, and the footer shows a version chip read from the top of this changelog — no separate version constant.

### Changed

- **Modernized the whole stack.** Migrated off defunct Universal Analytics to GA4; pinned Hugo `0.162.1` (local + CI); bumped the GitHub Actions deploy workflow off its 2019 `v0.0.1-preview` pin to current stable versions; and replaced the unowned m10c theme git submodule with a custom theme in `themes/squalr/`. The CSS pipeline is plain CSS through Hugo (`resources.Get | minify | fingerprint`) — no npm, no Sass, no `node_modules`.
- **Projects support arbitrary `links`** beyond `repo` / `demo`, and the `squalr.us` project lives at a clean `/projects/squalr-us/` instead of `/projects/https/`.

### Fixed

- **Pagination paginates at 15** — it was silently defaulting to 10 from a flat `pagination.pagerSize` config key Hugo never read. (`config.yaml`)

---

Build and CI changes a site reader wouldn't notice — the Hugo `0.162.1` pin (local + CI), the GA4 migration, and the GitHub Actions bumps — are tracked in `docs/TECH-STACK-AUDIT.md` and git history, not here.
