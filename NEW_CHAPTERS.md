# New Chapters Added

This document records the three new narrative chapters wired into `game.js` in this update.

## Chapter 13 — The Reformation
- **Themes:** Sola Fide, Sola Scriptura, Solus Christus, Sola Gratia, Soli Deo Gloria (the five solae)
- **Branches:**
  - "Stand upon Sola Scriptura" → Chapter 14 (+15 faith, +20 wisdom, +5 compassion)
  - "Embrace Sola Fide" → Chapter 15 (+25 faith, +5 wisdom, +10 compassion)
  - "Live for Soli Deo Gloria" → Chapter 0 (+10 faith, +10 wisdom, +20 compassion)

## Chapter 14 — The Church Fathers
- **Themes:** Athanasius (deity of Christ), Augustine (grace and Confessions), Irenaeus (defending the apostolic faith), Council of Chalcedon (two natures of Christ)
- **Branches:**
  - "Defend the deity of Christ with Athanasius" → Chapter 13 (+20 faith, +10 wisdom, +5 compassion)
  - "Confess grace with Augustine" → Chapter 15 (+15 faith, +15 wisdom, +10 compassion)
  - "Contend for the faith once delivered" → Chapter 11 (+10 faith, +20 wisdom, +5 compassion)

## Chapter 15 — Perseverance & Glory
- **Themes:** Saints persevering by God's power, the New Heavens & New Earth, the consummation of all things
- **Branches:**
  - "Persevere in the power of the Spirit" → Chapter 12 (+25 faith, +5 wisdom, +10 compassion)
  - "Anticipate the New Heavens & New Earth" → Chapter 0 (+10 faith, +20 wisdom, +10 compassion)
  - "Surrender to the consummation" → Chapter 5 (+10 faith, +10 wisdom, +25 compassion)

## RouteMap Reachability
To make the new chapters reachable, the following existing routeMap entries were updated:
- `"2-0-0"`: 4 → **13** (from *The Library of God's Word*)
- `"3-0-0"`: 4 → **14** (from *The Mission Field*)
- `"4-0-2"`: 5 → **15** (from *The Glory of God*)

The new chapters also interconnect via the pre-existing routeMap entries:
- 13 ↔ 14, 15
- 14 ↔ 13, 15, 11
- 15 ↔ 11, 12, 13
