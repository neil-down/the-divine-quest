# QA Report — The Divine Quest

## v1.0.2 — Robustness Audit: Battle, Puzzle & Co (2026-09-24)

### Build
- Clean, **zero warnings** (6 superseded duplicate i18n keys removed; duplicate `case 'choice'` in `showPuzzle` removed). `npm run build` = fetch → lint → gen → esbuild, PASS on 30 chapters / 47 exact WEB verses.

### Browser smoke test (`npm run browser:smoke`, **NEW** — Playwright + headless Chromium)
First real-browser verification of the project. Serves `dist/` over localhost; **21 probes, 0 errors, 0 console/page errors, exit 0**. Covers: story boot + stats render + `APP_VERSION 1.0.2`; single gear button that opens/closes Settings; creed-match + solas-match solved via real button clicks (wrong selection safe); puzzle-solve VFX actually appending visible elements; a real battle won with '🙏 Prayer' clicks + reward + double-victory guard; corner-widget collision-free at 390×844 & 1280×800 measured bounding boxes; full-page screenshot capture. The suite caught two bugs jsdom cannot see (both fixed):
- `showPuzzle()` never set `this.currentPuzzle` — direct `showPuzzle()` calls (and clicks) crashed with `Cannot read properties of null (reading 'options')` (jsdom smoke masked it by pre-assigning the field).
- `getOverlayContainer()` bound puzzle-solve VFX to the *first* `.fixed.inset-0.z-50` it found — the hidden Settings panel — rendering rings/orbs invisibly. Now prefers an open `#puzzle-overlay`/`#battle-overlay`, then any visible `.fixed.inset-0.z-50`.

### Smoke test (fresh `dist/`, jsdom real-execution): `{"errors": [], "total": 0}` (exit 0, run twice)
New probes that *drive* previously-stubbed systems:
- **Battle driver**: starts a real fight vs Shadow of Doubt (Shadow hp 50, faith-weak), loops `useSkill('prayer')` until death, asserts rewards applied (`battleLoopCompletes`) and that a second `victory()` can't re-pay them (`battleDoubleVictoryBlocked`). Replaced the old passive `useSkill('smite')×2` probe — `smite` has a 1-turn cooldown so the fight could never finish. (Step-4 `missing-global` false-positives from this probe disappear once it passes.)
- **Puzzle probes**: `creed_match` renders an actual choice puzzle and solving it advances `solvedPuzzles` (`puzzleCreedRenders`/`puzzleCreedSolved`); `solas_match` satisfies its gate and does NOT crash on a wrong click (`puzzleSolasNoCrash`), then solves (`puzzleSolasSolved`).
- **Settings**: gear button present + clickable, `togglePanel()` shows the panel (`settingsButton`/`settingsPanelOpens`).
- **Nightmare cleanup scoping**: a foreign `.fixed.inset-0` overlay survives `endNightmare()` while a `data-tdq-nightmare="1"` overlay is removed (`nightmareScopedCleanup`).
- **Corner-widget spacing**: audio mute at 144px, ambient 208px, settings 272px rights; ritual at bottom-32, study guide bottom-44 (`audioToggleSpacing`/`ritualRaised`/`studyGuideRaised`).
- All v1.0.1 probes (Act III, Grace Shop, 40+ legacy) remain green. Zero console errors.

### Defects found & fixed this pass
- **Battle double-reward + crash** (victory during the 3 s pause → overlay already gone → null read, rewards paid twice). Guarded at source.
- **`solas_match` click TypeError** and **`creed_match` blank/unsolvable puzzle** — both real-user-visible crashes/dead-ends.
- **VFX/SFX unverifiable before**: battle-hit/defeat hooks had wrong targets and won the `tryHook` one-shot race → dead. Now event-driven (`battleHit`, `battleDefeat`).
- **Settings UI unreachable** (never injected) — reachable now.
- **Nightmare nuked the battle overlay & its own success screens**; sanity bar never existed; `bossesDefeated` never advanced; infinite-loop shake never cleared; `endMeditation` threw on manual close.
- **Corner occlusion** of Devotions/ritual/study-guide buttons.
- **Harness bug**: manual `dispatchEvent(DOMContentLoaded)` alongside jsdom's natural fire double-ran bootstraps (duplicate Settings instances/buttons). Manual dispatch removed; jsdom fires it at ~50 ms.

### Status: RUNNABLE — 30 chapters, 47 exact WEB verses, battle/puzzle/settings/nightmare/VFX/Audio systems defensively hardened; jsdom smoke + real-Chromium browser smoke both green (exit 0).

## v1.0.1 — Act III & Grace Shop Wiring (2026-09-24)

### Build
- Minification confirmed active (`esbuild minify: true`); `dist/bundle.js` ≈ 364 KB. `npm run deploy` added (build + `gh-pages -d dist`) — awaits a `git remote` (repo currently has none).
- `npm run content`: fetch → lint → gen. **47 verses** fetched (4 new: Ephesians 1:13-14, Revelation 22:20, Proverbs 18:10, Romans 8:23), **30 chapters**, lint PASS (reachability across the new ch24 → 26 edge, all `next` in range).

### Smoke test (fresh `dist/`): `{"errors": [], "total": 0}` (exit 0)
New/updated probes:
- `chapterCount30` (chapters ≥ 30); theme-verse known-set extended with the four Act III refs.
- **Act III reachability + rendering**: the play/choice step and themed-verse probes exercise the new arc without console errors; all loop-backs to the ch25 finale verified implicitly via `next`-range + DFS reachability in lint.
- **Grace Shop**: `graceMilestoneGrant` (awardMilestone pays +1 GP and dedups a second call), `faithHeadStart` (reset with `questPerks.faithHeadStart = 7` yields faith 57), `pathfinderSight` + `pathfinderSightReset` (variant text appears with the perk and no flag, then reverts when the perk is off).
- All v1.0.0 probes (40+) remain green.

### Defects found & fixed this pass
- **Choice-count linter too strict**: back-end enforced max 3 choices/scene; the Act III branch requires 4 in ch24. Schema evolved 2–3 → 2–4 (documented in `lint-content.mjs`).
- **Shop perks touched non-existent game fields** (`maxHealth`/`health`/`faith` — the narrative loop has no HP): re-pointed to real `questPerks` milestones + added a working Pathfinder perk.
- **Study-guide key collision (reprise)**: the doctrine library occupied keys 26–29; rekeyed to 30–37 to accommodate Act III topics 26–29.

### Status: RUNNABLE — 30 chapters, 47 exact WEB verses, Act III + finalized Grace Shop, lint PASS, full smoke green.

## v1.0.0 — Five-Wave Expansion: Act II & Meta-Systems (2026-09-24)

### Build
- `npm run build` = `fetch-verses` → `lint-content` (constitutional gate) → `gen-content` → esbuild. Clean. `dist/` verified complete against the `sw.js` v3 precache list (`index.html`, `offline.html`, `manifest.webmanifest`, `bundle.js`, `styles.css`, `assets/vendor/**` — all present). Viewport meta confirmed on `index.html` and `offline.html`.
- Bundle size: `dist/bundle.js` ≈ 364 KB unminified (dev). Minified production build remains ~293 KB.

### Smoke test (fresh `dist/`): `{"errors": [], "total": 0}` (exit 0)
New probes added across the waves (50+ total):
- **Acts bridge & content**: `chapterCount26`; WEB verse system with 43 verses (John 3:16 verbatim); gift advance + fruit; gate disabled/eligible; theme-verse render (known-ref membership incl. Act II chapters).
- **Wave 3**: `flagsLedger` (window `Set` identity), flag-variant scene swap + reset (`valleyWalk` toggles ch21 text), `explicitFactionApplied` (ch16 c0 → The Faithful +6, The Doubting 0), ending overlay renders with restart button, Faction-Standing block, Echoes-of-Your-Walk block, and Pilgrim ledger.
- **Wave 2**: devotion center API present; `verseOfDay` deterministic across calls; daily text resolves to WEB; streak increments; modal renders with close control.
- **Wave 4**: `studyGuideActII` (per-chapter topics for keys 16 & 25 complete: 3 questions, commentary, WEB scripture) and `studyGuideRendersChapterTopic` (chapter 17 topic renders in the panel); journal records chapter events (index 0 + dispatched 6), journal modal renders the Chapter-7 entry, floating button present; `achievementMilestones` (Pathfinder / Face to Face / Act II register in `earnedAchievements`).
- Zero console errors / uncaught exceptions across the whole simulated playthrough.

### Defects found & fixed this pass
- **`chapterChanged` detail mismatch**: the game dispatches `{chapter, scene}`, but `study-guide.js` treated `event.detail` as a bare number — auto-following the current chapter never worked (silent). Normalized in study-guide and in the new Journal.
- **Study-guide key collision**: doctrinal topics occupied keys 16–23, colliding with the new Act II chapters. Renumbered the doctrine library to keys 26–33 and authored aligned per-chapter topics for 16–25.
- **Lint-surfaced dead links** (reachability + next-range checks): ch1 c2 → 8, ch2 c0 → 13, ch3 c0 → 14 (were pointing at missing chapters); ch3 c1 fruit "wisdom" → "goodness" (not a Gal-5 fruit).

### Status: RUNNABLE — 26 chapters, 43 exact WEB verses, endings + flags + factions + devotion center + journal, lint PASS, full smoke green.

## Phase 1 Stage 1 — Content-Pack Engine & WEB Scripture (2026-09-23)

### Build
- `npm run build` = `scripts/gen-content.mjs` (regenerate `content/bundled-content.js` from `content/chapters.json` + `content/verses.json`) then `node esbuild.config.js` → `dist/bundle.js`, `dist/index.html` (now **derived from** the source `index.html`: module `<script>` tags stripped, `bundle.js` injected), `dist/styles.css`, PWA files, and `dist/assets/`. Clean.
- `node --check` passes on `game.js`, `verses.js`, `gifts.js`, `smoke-test.mjs`.

### Smoke test (fresh `dist/`): `{"errors": [], "total": 0}`
New probes beyond the Phase-0 globals check:
- **Content bridge**: `window.__TDQ_CONTENT` present; chapters array length === 16.
- **WEB verse system**: `VerseSystem.lookup('John 3:16')` returns verbatim WEB text ("…**God so loved the world**…"); `unlock('John 3:16')` marks it unlocked (localStorage `tdq_memory_verses`).
- **Gift system**: `GiftSystem.gift('faith', 1)` increments the persisted running total.
- **Theme verse render**: current scene's `#scripture-reference` equals a real WEB chapter-theme ref (John 14:6 / James 5:16 / …, verified via known-ref membership).
- **Requirement gates**: ch13 c0 (`wisdom ≥ 55`) renders its button `disabled` at fresh start (player wisdom 50); ch13 c1 ("Embrace Sola Fide") renders **eligible** (not disabled).

### Defects found & fixed this pass
- **i18n stat-label corruption**: `i18n.js` applies translations via `textContent` on `[data-i18n]` nodes; the source stat spans wrapped `#faith/#wisdom/#compassion`, so translation **erased the live stat value spans** → `updateStats` threw `Cannot set properties of null` at load. Exposed only after the dist template was replaced by the (data-i18n-bearing) source markup. Fixed: translatable labels are now leaf spans (`<span data-i18n="stat.faith">Faith</span>: <span id="faith">50</span>`).
- **Diverged dist template deleted**: the standalone ~300-line template in esbuild.config.js had drifted from source (no Gifts panel, no beat/fruit bar CSS). Removed in favor of deriving `dist/index.html` from source — one source of truth.
- **Missing styles**: `.beat-bar` / `.fruit-bar` had no CSS; added gold/pink gradient bar rules to the inline stylesheet.

## Phase 0 pass (2026-09-23)

Date: 2026-09-23 (Phase 0 pass)
Verified by: orchestrator (local build + corrected jsdom harness)

## Build
- `node esbuild.config.js` -> `dist/bundle.js` (~293 KB minified), `dist/index.html`, `dist/styles.css`, plus `dist/pwa.js`, `dist/sw.js`, `dist/offline.html`, `dist/manifest.webmanifest`, and the full `dist/assets/` tree (self-hosted tailwind + fontawesome + fonts). Clean; only cosmetic duplicate-i18n-key warnings from esbuild.
- `node --check dist/bundle.js` passes.
- `npm audit` -> **0 vulnerabilities** (esbuild bumped 0.24 → 0.28).

## Smoke test (corrected harness)
- Prior runs reported `{"errors": [], "total": 0}` under `runScripts: 'outside-only'` — that was a **false green**: with that option, the programmatically-injected `<script>` never executes, so every guarded play step was silently skipped.
- Harness now runs with `runScripts: 'dangerously'` and adds a **globals probe** asserting the core systems are actually wired to `window`: `game`, `visualEffects`, `battleEncounters`, `divineAudio`, `factionSystem`, `I18N`, `infiniteLoop`, `puzzleSystem`, `progressionSystem`, `SETTINGS`, `studyGuide`, and the `nightmare`/`nightmareMode`/`challenge` alias identity.
- Result (fresh `dist/`): `{"errors": [], "total": 0}` — zero console errors / uncaught exceptions, all probes green.

## Phase 0 defects found & fixed (previously silent at runtime)
- `visual-effects.js`: `_reducedMotion` + 4 effect methods were trapped inside the CSS template literal — constructor crashed on `this._reducedMotion is not a function` ~1 s after load, silently killing the VFX module. Methods moved into class body.
- `nightmare-system.js`: built around dead DOM (`#nightmare-ui`, `window.nightmare`) — threw inside timers; never initialized. Now registers `window.challenge/window.nightmare/window.nightmareMode` aliases, routes UI to `#challenge-ui` via `_getNightmareUI()`, and adds safe stubs for `checkRealityPuzzles`, `spawnChallengeEntities`, `drainFocus`.
- `infinite-loop.js`: stray `self.loops` reference replaced with `this.loopHistory`.
- `enhancements.js`: unguarded `window.matchMedia(...)` crashed under jsdom (and fragile legacy browsers) — added a safe polyfill.
- PWA dead: SW now self-hosted (no reliance on `./bundle.js` at repo root in dev); `dist/` build copies all PWA + asset files; `sw.js` v3 does tolerant per-file precache + offline fallback.

## Status: RUNNABLE, 0 runtime errors at load + simulated play (real execution verified).
