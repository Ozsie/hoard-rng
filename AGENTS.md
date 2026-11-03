# AGENTS.md — @hoard/rng

This is the first HOARD engine package.

## What this package is

- Seedable RNG + d6 success rolls, extracted from `src/core/dice.ts`.
  It is a dependency-free leaf: engine-agnostic, game-agnostic, no
  framework knowledge.
- The game consumes it through the `@hoard/rng` alias (set in
  `svelte.config.js`), pointing at `src/index.ts` — the game never uses
  the built `dist/`.

## Hard boundaries

- Only relative imports inside `packages/rng/src`. No imports from
  game code, Svelte, i18n, node builtins or any package — enforced by an
  eslint `no-restricted-syntax` override and `src/boundary.test.ts`.
  Tests may import `vitest`.
- The public surface is exactly `src/index.ts`; every export must be
  re-exported there (`src/publicSurface.test.ts` fails otherwise).
- The API is deliberately game-agnostic. The `Level`-to-threshold
  mapping is game knowledge and lives in the `src/core/dice.ts` facade,
  never here. Changing the threshold semantics in the package is a game
  rules change — RULES.md wins; ask before "fixing" either side.

## Commands

From `packages/rng` (standalone):

```bash
npm test          # vitest
npm run check     # tsc --noEmit
npm run lint      # eslint (root config; includes the package import rules)
npm run prettier  # prettier --check (fix via prettier:format)
npm run build     # tsc declarations + esbuild ESM bundle to dist/
```

The root `npm test`, `npm run check`, `npm run lint` and `npm run
prettier` also cover this package (root vitest include and tsconfig
include reach into `packages/*/src/**`). Run them before considering
work done.

## Conventions

- Prettier: single quotes, 2-space indent, trailing commas. Strict
  TypeScript: no `any`, no `console`, no non-null assertions where
  avoidable.
- Tests are colocated as `*.test.ts` next to the code they cover; add
  tests for any behavior change.
- `dist/` is build output: never edit it, never commit it.
- Publishing (`npm publish` from this folder) runs check + build + test
  via `prepublishOnly`. Bump `version` first. The package has no
  `license` field yet — that is a decision for the repo owner, do not
  add one unilaterally.
- No game content here by construction (the AI policy's content rules
  cannot apply); documentation text in this package is fine to write.
