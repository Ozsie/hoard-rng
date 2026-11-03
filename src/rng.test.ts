import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setRng,
  resetRng,
  createSeededRng,
  nextRandom,
  randomInt,
  shuffle,
} from './rng';

describe('rng', () => {
  beforeEach(() => {
    resetRng();
  });

  afterEach(() => {
    resetRng();
  });

  it('produces deterministic pseudo-random sequences', () => {
    const rng1 = createSeededRng(12345);
    const rng2 = createSeededRng(12345);

    const seq1 = [rng1(), rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2(), rng2()];

    expect(seq1).toEqual(seq2);
  });

  it('produces different sequences for different seeds', () => {
    const rng1 = createSeededRng(1);
    const rng2 = createSeededRng(2);

    expect(rng1()).not.toBe(rng2());
  });

  it('yields values in [0, 1)', () => {
    const rng = createSeededRng(42);
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('routes nextRandom through the current stream', () => {
    const expected = createSeededRng(7);
    setRng(createSeededRng(7));
    expect(nextRandom()).toBe(expected());
  });

  it('returns randomInt within [0, max)', () => {
    setRng(createSeededRng(99));
    for (let i = 0; i < 100; i++) {
      const value = randomInt(6);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(6);
    }
  });

  it('returns 0 from randomInt for non-positive max', () => {
    expect(randomInt(0)).toBe(0);
    expect(randomInt(-3)).toBe(0);
  });

  it('shuffles an array without losing elements', () => {
    const array = [1, 2, 3, 4, 5];
    const copy = [...array];
    const result = shuffle(copy);
    expect(result).toHaveLength(5);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('is deterministic under a fixed seed', () => {
    setRng(createSeededRng(12345));
    const first = [
      nextRandom(),
      randomInt(100),
      shuffle([1, 2, 3, 4, 5]).join(','),
    ];

    setRng(createSeededRng(12345));
    const second = [
      nextRandom(),
      randomInt(100),
      shuffle([1, 2, 3, 4, 5]).join(','),
    ];

    expect(first).toEqual(second);
  });
});
