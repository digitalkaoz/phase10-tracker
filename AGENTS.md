# Phase 10 Tracker — Agent Guide

## Commands

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `pnpm dev`          | Vite dev server                                               |
| `pnpm build`        | `tsc -b && vite build`                                        |
| `pnpm lint`         | oxlint (no args)                                              |
| `pnpm fmt`          | oxfmt (auto-format)                                           |
| `pnpm fmt:check`    | oxfmt --check                                                 |
| `pnpm test`         | Vitest interactive (all projects)                             |
| `pnpm test:run`     | `vitest run` (unit + browser)                                 |
| `pnpm test:unit`    | Vitest, node env, `src/**/*.test.ts`                          |
| `pnpm test:browser` | Vitest browser (playwright), `src/**/*.browser.test.{ts,tsx}` |
| `pnpm coverage`     | Vitest unit + v8 coverage                                     |

CI order: `pnpm fmt:check` → `pnpm lint` → `pnpm build` → `pnpm test:unit` → `pnpm test:browser`

## Testing

- **Vitest workspace** defined in `vitest.workspace.ts` — two projects:
  - `unit`: `vitest.unit.config.ts`, node environment, `src/**/*.test.ts`
  - `browser`: inline config, Playwright (chromium), `src/**/*.browser.test.{ts,tsx}`
- `vite.config.ts` provides shared Vite plugins (react, tailwind, PWA) to both projects
- Component tests use `vitest-browser-react` for rendering and interaction testing

## Lint & Format

- **oxlint** instead of ESLint. No `.eslintrc*`. Config: `.oxlintrc.json`
- oxlint supports `// eslint-disable-next-line @typescript-eslint/rule-name` comments
- Error format: `typescript(rule-name)`; disable comment accepts both `typescript/` and `@typescript-eslint/` prefixes
- `maxWarnings: 0` — lint must pass clean
- **oxfmt** instead of Prettier. Config: `.oxfmtrc.json` (80 width, 2 spaces, singleQuote=false, trailingComma=all)
- `pnpm fmt` to format; `pnpm fmt:check` for CI

## TypeScript

- TS 6.0, `erasableSyntaxOnly: true` (no enums, no namespaces, no parameter properties)
- `verbatimModuleSyntax: true` — must use `import type` / `export type` for type-only imports
- `noUnusedLocals`, `noUnusedParameters` — no dead code
- Project references: `tsconfig.app.json` (src/) + `tsconfig.node.json` (config files)

## Testing

- Unit tests: `src/**/*.test.ts` via `vitest run --config vitest.unit.config.ts` (node env, fast)
- Browser tests configured in `vite.config.ts` (playwright, chromium) — slower, not in CI
- `pnpm test` runs vitest interactively; `pnpm test:run` runs all

## Architecture

- **React 19** SPA with view-based navigation (`App.tsx` dispatches between picker/setup/game)
- **PWA** via `vite-plugin-pwa` (auto-update, full manifest, workbox service worker)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`
- **i18n**: `LocaleContext` provides translations; `"en"` and `"de"` in `src/i18n/index.ts`
- **Persistence**: `useLocalStorage<T>` hook, sessions stored under `phase10_sessions` key
- **Types**: `PhaseNumber = 1 | 2 | ... | 10` in `src/types/game.ts`
- **Scoring**: `src/utils/scoring.ts` with `calcCardScore`, `getWinner`, `emptyCardCount`

## Key Types

```typescript
type PhaseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
// currentPhase uses PhaseNumber | 11 (11 = completed)
```

## Notes

- oxlint's `no-unsafe-type-assertion` is in the `suspicious` category (error level). Use `as unknown as T` double-cast or disable comments for unavoidable cases (e.g. generic `JSON.parse` in `useLocalStorage`).
- All scores are non-negative integers, incremented in steps of 5 via the card calculator.
- Round winner is the finisher with lowest score; tied = first registered wins.
