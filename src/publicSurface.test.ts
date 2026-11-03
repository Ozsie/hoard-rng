// The public-surface completeness test: every named export of every
// source module must be reachable through the package entry (index.ts),
// so nothing can quietly fall outside the public surface (mirrors
// src/uikit/publicSurface.test.ts).

import { describe, expect, it } from 'vitest';
import * as dice from './dice';
import * as index from './index';
import * as rng from './rng';

describe('hoard-rng public surface', () => {
  it('re-exports every module export from the package entry', () => {
    const surface = new Set(Object.keys(index));
    for (const [moduleName, module] of [
      ['rng', rng],
      ['dice', dice],
    ] as const) {
      for (const exportName of Object.keys(module)) {
        if (!surface.has(exportName)) {
          throw new Error(
            `'${exportName}' from ${moduleName} is missing from the package entry`,
          );
        }
      }
    }
  });

  it('exports only the expected names', () => {
    expect(Object.keys(index).sort()).toEqual(
      [
        'createSeededRng',
        'nextRandom',
        'randomInt',
        'resetRng',
        'roll',
        'setRng',
        'shuffle',
      ].sort(),
    );
  });
});
