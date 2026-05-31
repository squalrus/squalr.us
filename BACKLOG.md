# Backlog

Deferred work items for squalr.us. Not blocking; scheduled for a focused pass when convenient.

## Migrate SCSS `@import` → `@use` / `@forward`

**Why:** Dart Sass deprecated `@import` rules; they will be removed in Dart Sass 3.0.0. We
currently build on Dart Sass 1.100.0, where `@import` still works but emits deprecation
warnings on every build.

**Where:** `themes/squalr/assets/css/main.scss` imports `base`, `extra`, and the
`components/*` partials via `@import`.

**Catch:** The partials rely on globally-scoped variables (`$darkest-color`, `$primary-color`,
etc.) defined at the top of `main.scss`. `@use` namespaces members per-module, so a naive
swap breaks those references. The migration requires restructuring — e.g. move the variables
into a dedicated module the partials `@use` (or `@forward`), or pull them in with
`@use '...' as *`. Test the compiled output against the current CSS to confirm no visual
regressions.

**When:** Before upgrading to Dart Sass 3.0.0 (not yet released).
