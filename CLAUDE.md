# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # svelte-check (type-check) THEN vite build → dist/
npm run check    # svelte-check only (type-check, no build)
npm run preview  # serve the production build locally
```

There is no test runner and no linter configured. `svelte-check` is the only static
gate — run `npm run check` after non-trivial changes. `tsconfig.json` is strict and
enables `noUnusedLocals` / `noUnusedParameters`, so dead locals fail the build.

Pushing to `main` auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Architecture

A single-page, no-backend web toy: a five-step "burn a turtle for good weather"
ritual. Vite 6 + Svelte 5 (runes) + TypeScript, HTML Canvas 2D for all imagery.

### Flow is a state machine over one global singleton

`src/lib/stores.svelte.ts` exports `ritual` — a single `RitualState` instance holding
`step`, `wish`, and `drawingDataUrl` as `$state` runes. `App.svelte` maps
`ritual.step` (`form → draw → pray → burn → done`) to one component in `src/steps/`.
All step components mutate the same `ritual` singleton and call `ritual.goTo(...)`;
there is no router and no prop drilling of state.

**`pray` and `burn` are "immersive" steps** — `App.svelte` switches to a dark
background and hides the progress dots + footer for them (see the `immersive` derived
value). The three progress dots only represent `form / draw / done`.

### The `.svelte.ts` extension is load-bearing

Runes (`$state`, `$derived`) work in a plain `.ts` module **only** if the file is named
`*.svelte.ts`. That's why the store is `stores.svelte.ts`. Keep that extension for any
non-component module that uses runes.

### Two layers: Svelte UI vs. framework-agnostic canvas

`src/canvas/` is pure TypeScript that depends only on the DOM, never on Svelte. The
`src/steps/` components own DOM/canvas elements and drive the canvas modules:

- `stickers.ts` — sticker data model + emoji palette + `arrangeTurtles(n)` layout.
- `exportPaper.ts` — composites cream paper + stickers + wish text into a PNG data URL
  (stored in `ritual.drawingDataUrl`), consumed by the burn step.
- `FireEngine.ts` — the burning animation (see below).
- `resultCard.ts` — the shareable completion image.

### Sticker coordinates are fractional, not pixels

A `Sticker` stores `xf`, `yf` (center, 0–1 of paper width/height) and `sizeF` (font
size as a fraction of paper width). This keeps composition identical across screen
sizes — `exportPaper.ts` and the editor both multiply by the current paper dimensions.
Stickers may not be placed below `STICKER_MAX_YF` (0.74); that band is reserved for the
wish text.

### Two ritual invariants encoded in code

1. **Turtles always face the sun.** The sun is fixed at `xf = 0.5`. In
   `exportPaper.ts`, `shouldFlip()` horizontally mirrors any turtle whose `xf < 0.5`.
2. **Wishes must be positive-only.** `src/lib/validation.ts` `checkWish()` rejects the
   character `雨` (rain) outright and blocks a list of negative words
   (`不要`, `別`, `颱風`, …). This is a deliberate feature of the ritual, not incidental
   validation — preserve it when touching the form.

### FireEngine: noise-dissolve burn

`FireEngine.ts` does **not** wipe the paper top-down with a gradient. It precomputes a
low-res (120×160) "burn order" map = `(1 - y) * 0.72 + valueNoise` (bottom burns first,
noise makes the edge irregular). Each frame it thresholds that map to erase burnt cells
via `destination-out`, draws a red ember band just ahead of the threshold, and spawns
flame/ash particles from the live burn front. Honors `reducedMotion` by shortening the
burn duration.

### Deprecated stubs — do not build on these

`src/canvas/DrawingBoard.ts` and `src/canvas/presets.ts` are empty `export {}` stubs
left from an earlier free-draw design that was replaced by the emoji-sticker composer.
Ignore them; the current draw step is `StepDraw.svelte` + `stickers.ts` +
`exportPaper.ts`.

### Persistence

`src/lib/storage.ts` remembers the last submitted form in `localStorage` (key
`burn-turtles:lastWish:v1`), defensively string-coercing every field on load and
silently no-op'ing in private mode. `ritual` seeds `wish` from it on init and on
`reset()`.

## Conventions

- Code comments and UI copy are in **Traditional Chinese**; match that when editing.
- `vite.config.ts` sets `base: './'` (relative paths) so the build works on both a
  GitHub Pages project subpath and a custom domain — do not change to an absolute base.
- `PLAN.md` is the original milestone plan (historical context, may be stale vs. code).
