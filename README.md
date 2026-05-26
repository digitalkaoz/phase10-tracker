# Phase 10 Tracker

A mobile-first PWA for tracking scores, phases, and round-by-round progress in Phase 10 card games. Supports 2–6 players, English and German locales, and runs entirely in the browser.

## Tech Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Framework      | React 19                                 |
| Language       | TypeScript 6.0 (`erasableSyntaxOnly`)    |
| Build          | Vite 8                                   |
| Styling        | Tailwind CSS v4                          |
| PWA            | `vite-plugin-pwa` (Workbox, auto-update) |
| Lint           | oxlint                                   |
| Format         | oxfmt                                    |
| Test           | Vitest 4 (unit + browser/Playwright)     |
| Package mgr    | pnpm                                     |

## Quick Start

```sh
pnpm install
pnpm dev          # Vite dev server
pnpm build        # tsc -b && vite build
pnpm test:run     # all tests
pnpm lint         # oxlint
pnpm fmt          # oxfmt auto-format
```

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # View dispatcher (picker/setup/game)
├── index.css                   # Tailwind + custom theme
├── types/game.ts               # Core types (PhaseNumber, Player, Round, Session, …)
├── i18n/
│   ├── index.ts                # EN / DE translations
│   └── useLocale.ts            # Locale context + hook
├── hooks/
│   ├── useLocalStorage.ts      # Generic localStorage persistence
│   └── useSessions.ts          # Session CRUD
├── utils/
│   ├── scoring.ts              # Card scoring, winner detection
│   └── scoring.test.ts         # Unit tests
└── components/
    ├── SessionPicker.tsx        # Home screen
    ├── SessionCard.tsx          # Session summary card
    ├── GameSetup.tsx            # New game form
    ├── GameBoard.tsx            # Main game view
    ├── PlayerCard.tsx           # Per-player display
    ├── PhaseIndicator.tsx       # Phase progress dots
    ├── ScoreEntryModal.tsx      # Round score entry bottom sheet
    ├── CardCalculator.tsx       # Card counting UI
    ├── RoundsHistory.tsx        # Past rounds modal
    ├── LocaleSwitcher.tsx       # EN / DE toggle
    └── icons.tsx                # SVG icon components
```

## Scripts

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Vite dev server                           |
| `pnpm build`        | Type-check + build                        |
| `pnpm lint`         | oxlint (must pass clean)                  |
| `pnpm fmt`          | oxfmt auto-format                         |
| `pnpm fmt:check`    | oxfmt check (CI)                          |
| `pnpm test`         | Vitest interactive (all projects)         |
| `pnpm test:run`     | `vitest run` (unit + browser)             |
| `pnpm test:unit`    | Vitest node env, `src/**/*.test.ts`       |
| `pnpm test:browser` | Vitest browser (Playwright chromium)      |
| `pnpm coverage`     | Unit tests with v8 coverage               |

CI order: `fmt:check` → `lint` → `build` → `test:unit` → `test:browser`

## Conventions

- **TypeScript**: `erasableSyntaxOnly` (no enums, namespaces, parameter properties) and `verbatimModuleSyntax` (use `import type` / `export type`).
- **Lint**: oxlint in `suspicious`/`correctness` mode. No ESLint. Disable with `// eslint-disable-next-line typescript/rule-name`.
- **Format**: oxfmt — 80 width, 2 spaces, trailing commas, double quotes.
- **Scoring**: All scores are non-negative integers. Only the round winner may score 0.
- **Winner**: Lowest score among players who completed all 10 phases. Ties go to the first registered.

## Data Model

- **Session**: `{ id, createdAt, updatedAt, players[], rounds[], status, winnerId? }`
- **Player**: `{ id, name, currentPhase (1–10 \| 11), totalScore, completedGame }`
- **Round**: `{ roundNumber, entries: Map<playerId, { phaseCompleted, score }> }`
- **Phases**: 10 phases with set/run/color requirements expressed as descriptions only (game logic is manual).

## Features

- Create & manage multiple game sessions (localStorage persistence)
- Per-round score entry with manual input or card calculator (low/high/skip/wild)
- Automatic phase advancement and winner detection
- Round-by-round history with per-round winners highlighted
- EN / DE localization, persisted preference
- PWA: standalone, portrait-locked, installable, fully offline-cached
- Dark-only theme with safe-area insets for notched devices
