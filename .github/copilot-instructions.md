Purpose
This file gives succinct, repository-specific guidance for an AI coding agent working on the KBV2 codebase.

Quick architecture summary
- Frontend: Vite + React + TypeScript app in `src/`.
- Mobile wrapper: Capacitor (see `android/` and `@capacitor/*` deps).
- State/remote data: combination of `zustand` (local store), `@tanstack/react-query` and `swr` for network/cache patterns.
- UI: Tailwind + Storybook. Components live under `src/components/` and use contexts in `src/contexts/` and `context/`.
- Data files: canonical data in `src/data/` and public fixtures in `public/data/` (e.g. `donnees-kbv.json`).
- Native integrations: Capacitor plugins used include `filesystem`, `preferences`, `share`, `local-notifications`.
- Observability: Sentry is integrated (`@sentry/react`).

Primary workflows & commands
- Local dev: `npm run dev` (Vite). Use `npm run dev:full` to run Vite + Storybook concurrently.
- Build: `npm run build` (also `build:prod`, `build:analyze`).
- Unit tests: `npm run test` (dev UI), `npm run test:run` to run vitest headless, `npm run test:update` to update snapshots.
- E2E: `npm run test:e2e` (Playwright). Use `test:e2e:debug` or `test:e2e:ui` for interactive debugging.
- Storybook: `npm run storybook` / `npm run build-storybook`.
- Lint/type/format: `npm run lint`, `npm run type-check`, `npm run format` / `format:check`.
- CI check: `npm run ci` (runs lint → type-check → coverage tests → build).

Project-specific patterns and conventions
- Context-first patterns: application-wide behavior (auth, settings, toast, platform) is implemented via React Contexts under `src/contexts/` and `context/`. Prefer adding app-level state/logic there rather than ad-hoc prop drilling.
- `src/data/` contains canonical lists and JSON fixtures used by the app (e.g. `real-data.json`, `demo-data.json`). When mocking or seeding tests, prefer these files.
- Component stories: many UI components have Storybook stories—use Storybook to prototype visual changes before integrating into pages.
- Tests: unit tests use `vitest` + `@testing-library/react`. E2E lives under `e2e/` and uses Playwright. Follow existing test patterns (see `e2e/*.spec.ts` and `src/components/*/*.test.tsx`).
- Routing: app uses `react-router-dom`. Inspect `src/main.tsx` / `src/App.tsx` for route registration.

Integration & native notes
- Android native wrapper: `android/` folder is the Capacitor Android project—change native settings there. Use `@capacitor/cli` to sync and run on device.
- Files & persistence: the app uses `@capacitor/filesystem` and `idb` (IndexedDB) for local persistence and backup. Backups/export are in `public/data/`.

Where to look for examples
- Auth + app-level flows: `src/contexts/AuthContext.tsx`, `src/contexts/SettingsContext.tsx`.
- Global search: `src/context/GlobalSearchContext.tsx` demonstrates cross-component communication.
- Tests: `e2e/` (Playwright), `src/components/*/*.test.tsx` (Vitest + Testing Library).
- Android packaging: `android/` and `capacitor.config.ts`.

Agent behavior rules (actionable and repo-specific)
- Preserve existing Context patterns: add or extend `src/contexts/*` for app-level concerns.
- Prefer using `src/data/*` fixtures for mock data in tests; do not hardcode sample data inline when an existing fixture applies.
- When changing UI, update or add Storybook stories to make reviewable visual diffs.
- Run `npm run lint` and `npm run type-check` before opening PRs; CI expects zero lint warnings.
- Use `npm run test:run` locally to validate unit test runs; use `npm run test:e2e` for Playwright checks.

If you modify native/mobile behavior
- After JS changes that affect native plugins, run `npx cap sync` (or use the Capacitor CLI) and rebuild the native project in `android/`.

Asking for clarification
If anything here is unclear or you want more examples (file-level walkthroughs, common refactor patterns, or preferred commit messages), say which area to expand.
