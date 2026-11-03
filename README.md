# @hoard/rng

Seedable RNG and dice rolls for deterministic games. Part of the HOARD
engine packages; has no dependencies and no game-specific knowledge.

## Install

```bash
npm install @hoard/rng
```

Requires Node 18+ (ESM only).

## Usage

```ts
import {
  createSeededRng,
  nextRandom,
  randomInt,
  roll,
  setRng,
  shuffle,
} from '@hoard/rng';

// All randomness flows through one swappable stream, so a game run can
// be made reproducible by seeding it:
setRng(createSeededRng(12345));

// The dice mechanic: roll N d6 and count results at or above a
// threshold. The caller decides which face counts as a success:
const hits = roll(4, 6); // roll 6 d6, count 4+

// Non-dice gameplay randomness:
const value = nextRandom(); // [0, 1)
const index = randomInt(6); // integer in [0, 6)
const deck = shuffle(['a', 'b', 'c']); // in-place Fisher-Yates

// Restore unseeded randomness:
resetRng();
```

## API

| Export            | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| `roll(threshold, dice)` | Rolls `dice` d6, returns how many results are `>= threshold`      |
| `createSeededRng(seed)`  | Deterministic pseudo-random stream, values in `[0, 1)`             |
| `setRng(fn)`      | Replaces the current randomness stream                                    |
| `resetRng()`      | Restores the default (`Math.random`)                                     |
| `nextRandom()`    | The raw value of the current stream, in `[0, 1)`                         |
| `randomInt(max)`  | Integer in `[0, max)` from the current stream (`0` for non-positive max) |
| `shuffle(array)`  | In-place Fisher-Yates shuffle, returns the same array                     |

## Design notes

- **One stream, many consumers.** Every gameplay-affecting draw should
  go through this stream; seeding it makes a whole run reproducible.
  Seed a fresh `createSeededRng(seed)` per independent subsystem if you
  want subsystems reproducible in isolation.
- **Thresholds, not difficulty.** `roll` takes a plain number, so what
  counts as a success is the caller's decision. (In the Drakriddarna
  game, the `src/core/dice.ts` facade maps its hero-level enum to
  thresholds 5/4/3.)
- The stream is module state, deliberately: `setRng`/`resetRng` swap it
  for everyone. The module has no import-time side effects
  (`sideEffects: false`).

## Development

```bash
npm test    # vitest
npm run check  # tsc --noEmit
npm run build   # declarations (tsc) + ESM bundle (esbuild) to dist/
npm publish     # prepublishOnly runs check + build + test first
```

