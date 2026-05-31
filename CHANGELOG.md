# Changelog

User-visible changes to squalr.us, newest first. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the site uses [semver](https://semver.org/) — see [BACKLOG.md](./BACKLOG.md#shipping-a-backlog-item) for how each backlog item gets versioned and migrated here.

## [1.0.0] — 2026-05-30

The first versioned release — a full cyberpunk redesign, plus the backlog / changelog / versioning workflow the site now runs on. The [story is its own blog post](/2026/06/modernizing-my-hugo-blog-in-2026/).

### Added

- **Cyberpunk homepage redesign.** An arcade-pixel hero (Press Start 2P) with a neon flicker on the lit word and a blinking cursor, a textured background (dot grid, horizon glow, CRT scanlines, vignette), project cards with screenshot-or-generated-terminal banners and corner-bracket hovers, color-coded status badges, and projects ↔ posts cross-linking ("◇ N field notes" on cards, project chips on posts). Teal / cyan / ember neon on blue near-black. (`themes/squalr/layouts/index.html`, `themes/squalr/assets/css/`)
- **Configurable hero.** The kicker, heading lines, lit neon word, subtitle, status, and flavor chip all come from `config.yaml` (`params.hero`) — wrap a word in `{braces}` to make it the lit word, end a line with `.` for the ember dot. (`config.yaml`)
- **Project galleries + featured images.** A project can carry a featured image (card banner + detail hero) and a captioned gallery on its detail page; image-less projects get an auto-generated faux-terminal banner (driven by an optional `terminal:` frontmatter block) instead of a blank box. (`themes/squalr/layouts/partials/`)
- **Public changelog + backlog + a version.** [/changelog](/changelog/) and [/backlog](/backlog/) render straight from the root `CHANGELOG.md` / `BACKLOG.md` at build time, and the footer shows a version chip read from the top of this changelog — no separate version constant.

### Changed

- **New type + color system.** Space Grotesk (body), JetBrains Mono (code / labels), and Press Start 2P (arcade headers), with the whole site moving to the teal (`#2ee6c8`) / cyan (`#37c0ff`) / ember (`#ff8a3c`) palette on `#0a0e12`. (`themes/squalr/assets/css/`)
- **Projects support arbitrary `links`** beyond `repo` / `demo`, and the `squalr.us` project now lives at a clean `/projects/squalr-us/` instead of `/projects/https/`.

### Fixed

- **Pagination paginates at 15** — it was silently defaulting to 10 from a flat `pagination.pagerSize` config key Hugo never read. (`config.yaml`)
- **SCSS theme colors compile again** — restored the `resources.ExecuteAsTemplate` step a stale build cache had been masking, along with CSS fingerprinting. (`themes/squalr/layouts/_default/baseof.html`)

---

Build and CI changes a site reader wouldn't notice — the Hugo `0.162.1` pin (local + CI), the SCSS migration to Dart Sass `1.100.0`, the GA4 migration, and the GitHub Actions bumps — live in [TECH-STACK-AUDIT.md](./TECH-STACK-AUDIT.md) and git history, not here.
