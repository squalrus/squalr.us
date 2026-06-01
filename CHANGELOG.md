# Changelog

User-visible changes to squalr.us, newest first. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the site uses [semver](https://semver.org/) — see [BACKLOG.md](./BACKLOG.md#shipping-a-backlog-item) for how each backlog item gets versioned and migrated here.

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
