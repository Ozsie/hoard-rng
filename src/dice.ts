import { nextRandom } from './rng';

/**
 * Rolls `dice` six-sided dice and counts the results at or above
 * `successThreshold`. The threshold (not a difficulty enum) is the input:
 * the caller decides which face counts as a success.
 */
export const roll = (successThreshold: number, dice: number): number => {
  let successes = 0;
  for (let i = 0; i < dice; i++) {
    if (Math.floor(nextRandom() * 6) + 1 >= successThreshold) {
      successes++;
    }
  }
  return successes;
};
