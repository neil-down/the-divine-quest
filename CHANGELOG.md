# Changelog — The Divine Quest

## Layer 5 — Parallel Deepening (2026-08-27)
- **Story II**: Two new chapters — "The Communion of Saints" (11) and "The New Heavens and New Earth" (12) — wired into the existing branch router. (Fixes a latent routing crash: routeMap already referenced 11/12 but the chapter objects were missing.)
- **Combat II**: Boss "Legion" (multi-attack + summon/enrage at <30% HP), enemy "The Pharisee" (legalism self-righteousness debuff reducing wisdom gain); balance pass on Layer-4 combat numbers.
- **Puzzles II**: New `verse-order` puzzle type (sequence verse fragments); difficulty scaling tied to player faith level.
- **Study II**: Five new Reformed topics — Covenant, Atonement, Justification, The Church (ecclesiology), Eschatology.
- **Visuals II**: `battle-impact` screen shake on player hit (reduced-motion gated) and `choice-ripple` tap feedback on choice buttons.
- **Audio II**: Three ambient pad tracks (tabernacle, still-waters, heights) the ambient toggle cycles through; `levelup` and `defeat` SFX wired to level-up and game-over.
- **Progression II**: Achievements system (~10) with grace-point meta-currency and a Grace Shop (perks: +10 Max HP, +1 Starting Faith, Keener Insight).
- **PWA/Docs**: `sw.js` hardened to precache built `dist/` assets with a `CACHE_VERSION` constant; README + this changelog updated.

## Layer 4 — Eight-Way Expansion (2026-08-27)
New chapters (8–10), combat depth (Deceiver/Accuser/Sorrower, Intercession/Sword skills, 2-phase Archdemon), puzzles (verse-scramble/theme-match), study-guide expansion (Sola Fide, Trinity, Sanctification, Lord's Supper, Perseverance, Providence), visuals/accessibility (grace shimmer, conviction flash, focus-visible, prefers-reduced-motion), settings/progression (auto-save, reduced-motion toggle, 3 skill-tree nodes), audio (prayer/revelation/scripture SFX + ambient toggle), docs.

## Layer 3 — i18n & Mobile (2026-08-27)
i18n completion (en/es/fr) via source-string-as-key design; mobile/touch optimization (`.touch` class, 768/480 breakpoints, 44–48px targets, overlay scroll).

## Layer 2 — Systems (prior)
Settings menu, enemy archetypes + boss enrage, i18n scaffold, nightmare meta-progression, deeper endings.

## Layer 1 — Foundation (prior)
Sound design, mobile optimization, study guide, skill-tree expansion, branching router + reachability.
