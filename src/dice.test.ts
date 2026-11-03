import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { roll } from './dice';
import { setRng, resetRng } from './rng';

describe('dice', () => {
  beforeEach(() => {
    resetRng();
  });

  afterEach(() => {
    resetRng();
  });

  it('counts results at or above the threshold as successes', () => {
    // Mock RNG sequence returning 1, 2, 3, 4, 5, 6
    // Math.floor(rng * 6) + 1:
    // (0/6)->1, (1/6)->2, (2/6)->3, (3/6)->4, (4/6)->5, (5/6)->6
    const values = [0 / 6, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6];
    let idx = 0;
    setRng(() => values[idx++ % values.length]);

    expect(roll(5, 6)).toBe(2); // 5 and 6
    expect(roll(4, 6)).toBe(3); // 4, 5 and 6
    expect(roll(3, 6)).toBe(4); // 3, 4, 5 and 6
  });

  it('rolls zero dice to zero successes', () => {
    expect(roll(4, 0)).toBe(0);
  });
});
