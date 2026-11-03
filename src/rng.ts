// The swappable randomness stream for a game: everything that affects
// gameplay flows through here, so runs are reproducible when the rng is
// seeded. The stream defaults to unseeded Math.random.

let rng: () => number = Math.random;

/** Replaces the randomness stream (e.g. with a seeded one). */
export const setRng = (customRng: () => number) => {
  rng = customRng;
};

/** Restores the default, unseeded stream. */
export const resetRng = () => {
  rng = Math.random;
};

/** A small deterministic generator (mulberry-style hash chain) in [0, 1). */
export const createSeededRng = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t >>> 0) / 4294967296;
  };
};

/**
 * The raw seeded random value, for gameplay randomness that is neither a
 * dice roll nor a shuffle (never call `Math.random()` directly for
 * gameplay-affecting decisions).
 */
export const nextRandom = (): number => rng();

/** A random integer in [0, max) from the current stream. */
export const randomInt = (max: number): number =>
  max <= 0 ? 0 : Math.floor(rng() * max);

/** An in-place Fisher-Yates shuffle driven by the current stream. */
export const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};
