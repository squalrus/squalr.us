# Changelog

User-visible changes to squalr.us, newest first. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the site uses [semver](https://semver.org/) — see [BACKLOG.md](./BACKLOG.md#shipping-a-backlog-item) for how each backlog item gets versioned and migrated here.

## [1.9.3] — 2026-06-08

### Added

- **PNG export of Runway diagram.** The docs-lifecycle diagram is now available as a 1840px PNG alongside the SVG, suitable for sharing on social/LinkedIn. (`static/img/blog/runway-project-context/docs-lifecycle.png`)

### Changed

- **Runway content updated for three-command workflow.** Project page and blog post now describe all three slash commands — `/add-to-backlog`, `/pick-from-backlog`, and `/ship-from-backlog` — as the full capture → pick → ship cycle. Terminal card updated to show `/pick-from-backlog`. (`content/projects/runway.md`, `content/blog/runway-project-context.md`)

## [1.9.2] — 2026-06-08

### Added

- **"Why" section on all project pages.** Every project detail page now has a `## Why` section capturing the motivation behind the project — the problem it solved, the itch it scratched, or what made it worth building. Added to car-rainbow, merge-bot, glizzy-relay, runway, and squalr.us; normalized desktop-tracker's existing "Why it's useful" heading to match. (`content/projects/*.md`)
- **Runway project diagram.** MS Paint-style SVG diagram added to the Runway project page and blog post illustrating the docs-as-runway metaphor: CHANGELOG.md ramping up, core files on the plateau, BACKLOG.md ramping down, forward-motion arrow below. (`static/img/projects/runway/docs-lifecycle.svg`, `static/img/blog/runway-project-context/docs-lifecycle.svg`)
- **Runway blog post: "Five Docs, One Timeline" section.** New section added explaining how README.md, CONTRIBUTING.md, and CLAUDE.md anchor what the project is while CHANGELOG.md and BACKLOG.md face in opposite directions along the timeline. (`content/blog/runway-project-context.md`)

### Fixed

- **Internal links used hardcoded production domain.** Five template locations used `.Permalink` / `.Site.BaseURL` (which bake in `https://squalr.us/` at build time) instead of `.RelPermalink` / `relURL`. PR preview deployments and any locally-served `hugo --minify` build would navigate to production when clicking internal links. All internal nav links are now root-relative. (`themes/squalr/layouts/partials/post-li.html`, `pcard.html`, `_default/single.html`, `_default/terms.html`, `_default/baseof.html`)
- **Markdown content hardcoded production domain.** Prose links and the squalr.us project's `demo:` frontmatter used `https://squalr.us/` directly. Replaced with root-relative `/` so links resolve correctly in any environment. (`content/projects/runway.md`, `content/projects/squalr.us.md`, `content/blog/runway-project-context.md`)

### Changed

- **CLAUDE.md documents relative-link convention.** Added a note to the Deployment section explaining why internal links must always be root-relative (not hardcoded domain), which Hugo functions to use in templates, and how `hugo serve` masks the bug. (`CLAUDE.md`)
- **CLAUDE.md requires `## Why` on project pages.** "Adding a Project" section updated to make `## Why` an explicit required section, not an implied part of the prose overview. (`CLAUDE.md`)

## [1.9.1] — 2026-06-05

### Fixed

- **Discogs album art CSP block.** Added `https://i.discogs.com` to the `img-src` directive. Thumbnail images returned by the Discogs API (`info.thumb`) were blocked, leaving all album art blank in the Columbia House panel. (`staticwebapp.config.json`)

## [1.9.0] — 2026-06-05

### Added

- **Win95 Start menu.** Clicking the Start button in the taskbar now opens a Win95-style popup menu instead of immediately restoring all windows. Menu contains navigation links (Blog, Projects, Tags, Changelog, Backlog), a Chillout section link (removed from main nav in v1.8.1, now lives here), a dynamic restore section listing any currently minimized/closed windows, and a "Restore All" shutdown item at the bottom. Classic raised-border chrome, header strip, separators, hover highlight. Menu closes on click-outside or Escape. (`cybershack.js`, `_win95.scss`)
- **Columbia House and BMG Music Service ads.** Two new period-accurate retro ad banners added to the rotating sidebar ad slot — Columbia House (dark navy, "12 CDs for 1¢!") and BMG Music Service (royal blue/gold, "8 CDs FREE!"). Both join the existing 13-ad pool; JS picks one at random on load. (`index.html`, `_sidebar.scss`)

- **Google Analytics event instrumentation.** GA4 `track()` calls added across all interactive elements: Win95 window controls (minimize/maximize/close/restore), WinAmp shade/close/restore, Start menu open + nav clicks + restore + restore-all, guestbook sign, retro ad clicks, and gallery lightbox open/navigate/close. (`cybershack.js`)

### Fixed

- **Discogs API CSP block.** Added `https://api.discogs.com` to the `connect-src` directive in `staticwebapp.config.json`. The Columbia House collection widget (v1.8.2) was silently failing in the browser console because Discogs API calls were blocked by the site's Content Security Policy. (`staticwebapp.config.json`)

## [1.8.2] — 2026-06-05

### Added

- **Columbia House "Selection of the Month" sidebar.** New panel styled as a vintage Columbia House offer, showing the 5 most recent additions to the Discogs vinyl collection as if they were curated monthly selections. Fetches from the public Discogs REST API on page load and polls every 10 minutes. Includes dark navy header, red accent strip, and period-accurate fine-print disclaimer. Each entry shows cover art thumbnail, artist, title, and release year. (`index.html`, `_discogs.scss`, `cybershack.js`)

## [1.8.1] — 2026-06-05

### Removed

- **About and Chillout removed from main nav.** About linked to GitHub, which is already present as a social icon in the Connect panel — no navigation loss. Chillout is reserved for the planned Win95 Start menu. (`config.yaml`)

## [1.8.0] — 2026-06-05

### Added

- **Gallery lightbox with keyboard navigation.** Clicking a project gallery thumbnail now opens a full-screen overlay instead of navigating to a new tab. The lightbox is driven by the CSS `:target` pseudo-class (zero JavaScript for open/close) and styled as a Win95 window (gradient title bar, outset border, pixel-font label). Arrow keys (← →) cycle through images; Escape closes. Fade-in animation respects `prefers-reduced-motion`. (`projects/single.html`, `_project-detail.scss`, `_animations.scss`, `_responsive.scss`, `cybershack.js`)
- **Glizzy Relay gallery captions.** All six gallery screenshots now have captions (Homepage, Events, FAQ, Profile, Event detail, Scoreboard), visible in the lightbox title bar and caption strip. (`content/projects/glizzyrelay.com.md`)

## [1.7.3] — 2026-06-05

### Changed

- **Tag size variants.** Tags now come in three sizes: the default pill (post meta), a compact `.tag--small` (project cards and detail-page tech stack), and a spacious `.tag--large` (the `/tags/` taxonomy listing). Visual language — teal pill, black border — stays identical; only scale and padding differ. (`_tags.scss`, `pcard.html`, `terms.html`, `_projects.scss`, `_project-detail.scss`)
- **Refined project detail page layout.** The header area is reorganized into three explicit labeled rows — `status`, `links`, and `tech` — instead of a single mixed flex row with a floating tech block below. Each row has a small uppercase label (e.g. "status", "links", "tech") for scanability. Tech tags now use the compact `tag--small` variant. The related-posts heading updated from "Field notes" to "Posts about this project". (`projects/single.html`, `_project-detail.scss`)

## [1.7.2] — 2026-06-05

### Added

- **robots.txt with Sitemap directive.** Hugo's built-in `enableRobotsTXT` was already set, but the default template emits no `Sitemap:` line. A custom `layouts/robots.txt` now outputs `User-agent: *`, an explicit `Disallow:` (all crawlers allowed), and `Sitemap: https://squalr.us/sitemap.xml`. (`layouts/robots.txt`)
- **sitemap.xml.** Hugo generates a full `sitemap.xml` by default — confirmed working, no config change needed. All published pages are included with `lastmod` dates. (`public/sitemap.xml`)

### Changed

- **"Read more" link on project cards.** Project card titles were the only link to the detail page — easy to miss and visually ambiguous. The title `<h3>` is now plain text, and a dedicated `read more` link appears first in the card footer alongside the existing `live↗` / `github↗` links. (`pcard.html`, `_projects.scss`)

## [1.7.1] — 2026-06-04

### Changed

- **Project detail hero image uses 3-size responsive WebP srcset.** Previously generated two sizes (960w, 1366w); now matches the card pipeline at 683w, 1024w, and 1366w so browsers pick the right size across mobile, tablet, and desktop. (`single.html`)
- **Project gallery images now processed by Hugo's asset pipeline.** Gallery images moved from `static/` to `assets/img/projects/<slug>/` so Hugo can resize and convert them to WebP at build time. Each gallery image now renders a 3-size srcset (683w, 1024w, 1366w) with lazy loading. Falls back to a plain `<img>` if the asset isn't found. (`single.html`)
- **squalr.us project page corrected and fleshed out.** Tech stack was incorrectly listed as TypeScript/Node.js (copied from merge-bot); updated to Hugo, SCSS, Azure Static Web Apps, and GitHub Actions. Added prose body covering the theme, build pipeline, and deployment setup. (`content/projects/squalr.us.md`)

## [1.7.0] — 2026-06-04

### Added

- **15 rotating 90s retro sidebar ads.** One random "sponsor" ad appears in the sidebar on each page load, chosen from 15 period-accurate brands: Toys R Us (multicolored letters, CSS-flipped backwards R, N64 sale), RadioShack ("You've got questions, we've got answers!"), Pets.com (sock-puppet mascot, "Because pets can't drive!"), Tamagotchi ("Feed me! Keep me alive!"), AOL (free 1000 hours, CD in your mailbox), Ask Jeeves (italic serif butler, no keywords needed), Napster (orange cat, ★ 100% free), GeoCities (rainbow pixel-font logo on black, "Build yours!"), Blockbuster ("NO LATE FEES\*"), AltaVista ("Faster than Yahoo!"), Kozmo.com (1-hour free delivery), Priceline ("SHATNER SAYS: flights from $29"), Netscape Navigator ("Best viewed in NS!"), MySpace (Tom says, "Top 8 awaits!"), and LimeWire ("Definitely not a virus"). Each has era-accurate colors, a blinking promo line, and an ASCII mascot. (`index.html`, `_sidebar.scss`, `cybershack.js`)

### Fixed

- **JS cache-busting via Hugo fingerprint.** `cybershack.js` moved from `static/` to `assets/js/` so Hugo's asset pipeline assigns it a content-hashed URL (e.g. `cybershack.abc123.js`). Resolves a 7-day CDN cache issue where the old JS was served alongside new CSS — hiding all ads with no script to reveal any. (`index.html`, `baseof.html`)

## [1.6.5] — 2026-06-03

### Added

- **Functional Win95 window controls (minimize, maximize, close).** All `.win` title-bar buttons and the WinAmp title-bar buttons now work. Minimize collapses the window to its title bar; maximize expands it to fill the viewport (double-clicking the title bar also toggles maximize); close hides it entirely. WinAmp `_`/`□` toggle shade mode (compact title-bar-only view); `×` closes the player. State persists in `sessionStorage` and resets on a fresh visit. Degrades gracefully with no JS. All four window instances (homepage welcome, homepage guestbook, WinAmp player, inner-page content) share a single `partials/win-btns.html` partial so button markup is identical everywhere. (`win-btns.html`, `_win95.scss`, `_winamp.scss`, `cybershack.js`)
- **Win2000-style taskbar.** When any window is minimized or closed, a fixed taskbar appears at the bottom of the screen with three zones: a **Start button** (site favicon + "Start" label, far left), a **task strip** (restore buttons for each minimized/closed window or player, center), and a **live clock** in a sunken system-tray inset (far right, updates every second). Clicking **Start** clears `sessionStorage` and restores every window and the WinAmp player to their default visible state, then dismisses the taskbar. (`_win95.scss`, `cybershack.js`)
- **"NEW!" badge on project cards.** Projects with a `date:` within the last 45 days now display the same blinking red `NEW!` badge used on post list rows. (`pcard.html`)

## [1.6.4] — 2026-06-03

### Changed

- **Stylesheet inlined to eliminate render-blocking request.** The `cybershack.min.*.css` file was loaded via a synchronous `<link rel="stylesheet">`, blocking first paint for ~210 ms (est. 600 ms LCP/FCP savings). The CSS is now rendered inline in a `<style>` block by Hugo's asset pipeline — no external stylesheet request on any page. The `fingerprint` step is removed since there is no URL to version. (`index.html`, `baseof.html`)
- **Self-hosted fonts preloaded from HTML.** Added `<link rel="preload" as="font" type="font/woff2" crossorigin>` for all four `.woff2` files (`press-start-2p`, `vt323`, `comic-neue-400`, `comic-neue-700`) in both `index.html` and `baseof.html`. Fonts previously couldn't start downloading until the browser parsed CSS; preload tags let them fetch in parallel with the HTML itself, cutting the critical chain by ~400 ms. (`index.html`, `baseof.html`)
- **LCP album art marked high-priority.** Added `fetchpriority="high"` to `#np-art` in `index.html` so the browser prioritises the album art fetch once the JS-driven src is set. (`index.html`)
- **Forced reflow eliminated from WinAmp marquee.** The adaptive marquee used `void s.offsetWidth` to synchronously flush layout before measuring text overflow — a forced reflow that blocked the main thread. Replaced with a `requestAnimationFrame` callback: the class removal and property clears happen first, then the measurement and conditional class re-add happen in the next frame after the browser has committed the style changes. (`cybershack.js`)
- **Desktop Tracker project body written.** The project detail page had no body copy — clicking through landed on an empty shell. Added a description of what the app does (Virtual Desktop time tracking → BambooHR sync), how it works (pyvda, pystray, PyInstaller), and why it's useful. (`content/projects/desktop-tracker.md`)

## [1.6.3] — 2026-06-03

### Changed

- **External links and in-post body links open in a new tab.** A Hugo Markdown render hook (`layouts/_default/_markup/render-link.html`) now intercepts every link in post and project body copy — all open in a new tab, with `rel="noopener noreferrer"` added for external URLs. Template links that were missing `target="_blank"` are also fixed: project card `demo`, `repo`, and custom `links` in `pcard.html`; the Hugo credit in `baseof.html`; and the three Dura Digital links and the Hugo credit in `index.html`. Suggested by [Fiorella Franzini](https://linkedin.com/in/fiorella-franzini).

## [1.6.2] — 2026-06-02

### Fixed

- **WinAmp loved-heart always visible.** The ❤ indicator was previously toggled via `hidden` attribute in JS (`loved.hidden = track.loved !== '1'`), so it only appeared when the currently-loaded track had been loved — invisible on cold page load until the Next.js polling resolved. Removed the `hidden` attribute from the HTML element and the `loved.hidden` assignment from JS; the heart now shows persistently. (`index.html`, `cybershack.js`)

## [1.6.1] — 2026-06-02

### Changed

- **Responsive, WebP-optimized project images.** Featured images on project cards and detail pages are now processed through Hugo's asset pipeline — resized to display dimensions and served as WebP with a three-step `srcset` (683w, 1024w, 1366w for cards; 960w and 1366w for hero). Source images moved from `static/img/projects/` to `assets/img/projects/` so Hugo can process them at build time. Saves ~185 KiB on the Glizzy Relay card alone; all three project images benefit. (`pcard.html`, `projects/single.html`)

## [1.6.0] — 2026-06-02

### Added

- **"Relaunching squalr.us in 2026" post.** Covers the 2026 audit and modernization work: GA4 migration, GitHub Actions updates, Hugo version pinning, Dart Sass pipeline, custom theme build (parity → GeoCities redesign, gotchas), and the version/changelog/backlog workflow. (`content/blog/relaunching-squalr-us-in-2026.md`)

### Changed

- **Hero eyebrow is now config-driven.** The `·:¦:· HOME OF ·:¦:·` banner text reads from `params.hero.kicker` in `config.yaml` instead of being hardcoded in the template. (`index.html`, `config.yaml`)

## [1.5.0] — 2026-06-02

### Added

- **Period-accurate footer.** Footer now has a dark navy (`#000080`) background with high-contrast yellow/cyan text, replacing the low-contrast text on lavender that failed WCAG AA. Includes animated ⛏ under-construction pickaxes (respects `prefers-reduced-motion`), the full 88×31 badge strip, "Built with Hugo and GeoCities" credit, and "NO FRAMES · NO COOKIES · GEOCITIES APPROVED" tagline. (`_footer.scss`, `baseof.html`, `index.html`)
- **New 88×31 badges:** IE 4.0 (dark blue), HTML 2.0 (dark red), and Best Viewed Any Resolution (dark green / matrix green). Displayed in both the sidebar badge panel and the new footer badge strip. (`data/badges.yaml`, `_sidebar.scss`)

### Fixed

- **WCAG AA contrast failures (16 instances).** All failures flagged by Accessibility Insights FastPass resolved:
  - WinAmp playlist rows and footer scrobble count: `#3a7a3a` / `#2a5a2a` → `#428c42` / `#3f8c3f` on `#0d0d0d` (was 2.4–3.72:1, now 4.66–4.68:1). (`_winamp.scss`)
  - Sidebar `.wip` status: `#ff6a00` → `#c35000` on cream (was 2.81:1, now 4.72:1). (`_sidebar.scss`)
  - `.pstat.archived` badge: background `#808080` → `#727272` — white text now 4.57:1. (`_projects.scss`)
  - Footer badge text: `.foot a { color: #00ffff }` at specificity `[0,1,1]` was overriding badge colour classes at `[0,1,0]`; fixed by adding `.foot .b-*` rules at `[0,2,0]`. (`_footer.scss`)
- **`squalr.us` project demo link.** Was blank; set to `https://squalr.us/`. (`content/projects/squalr.us.md`)

### Changed

- **HTML 4.01 badge updated to HTML 4.0** (more colloquial for the era). (`data/badges.yaml`)

## [1.4.1] — 2026-06-02

### Changed

- **Stylesheet converted to SCSS.** `cybershack.css` split into 22 partials under `assets/css/` (one file per component: `_vars`, `_fonts`, `_base`, `_animations`, `_a11y`, `_win95`, `_layout`, `_banner`, `_nav`, `_sidebar`, `_winamp`, `_homepage`, `_projects`, `_posts`, `_guestbook`, `_footer`, `_inner`, `_prose`, `_tags`, `_project-detail`, `_pagination`, `_responsive`). SCSS nesting applied throughout to match DOM structure. Hugo Pipes pipeline updated to `toCSS (dict "transpiler" "dartsass") | minify | fingerprint`. Requires `sass-embedded` on `PATH` (`npm install -g sass-embedded`) — the pure-JS `sass` package does not support Hugo's embedded protocol. No visual output change.

## [1.4.0] — 2026-06-02

### Added

- **Last.fm profile link on the WinAmp widget.** The `♫ LAST.FM` title bar is now a link to the Last.fm profile. (`index.html`)
- **Loved track heart.** A pulsing ❤ indicator appears in the LCD meta row when the current/last scrobbled track has been loved on Last.fm. Shown/hidden on each 30s refresh. (`index.html`, `cybershack.js`, `cybershack.css`)
- **Recent tracks playlist.** The widget now fetches the last 5 tracks and renders them as a compact playlist panel below the album art — currently playing entry highlighted in green with ▶, previous entries numbered. (`index.html`, `cybershack.js`, `cybershack.css`)
- **Scrobble count footer.** A slim bar below the playlist shows the lifetime play count from `user.getinfo`, formatted with locale commas. Hidden until the async fetch resolves. (`index.html`, `cybershack.js`, `cybershack.css`)

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
