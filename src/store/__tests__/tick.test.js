import { describe, expect, it } from 'vitest';
import { runTick } from '../tick.js';

describe('runTick', () => {
  it('adds production gains based on elapsed minutes', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      lastTickTimestamp: startMs,
      resources: { coins: 10, comfort: 5 },
      cats: [
        { id: 'miso', currentRoom: 'bedroom' },
        { id: 'mochi', currentRoom: 'kitchen' },
      ],
    };

    const nextState = runTick(state, startMs + 120_000);

    expect(nextState.lastTickTimestamp).toBe(startMs + 120_000);
    expect(nextState.resources.coins).toBeCloseTo(10 + (0.3 + 3) * 2);
    expect(nextState.resources.comfort).toBeCloseTo(5 + 0.6 * 2);
  });

  it('does not subtract resources when time moves backwards', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      lastTickTimestamp: startMs,
      resources: { coins: 10, comfort: 5 },
      cats: [{ id: 'mochi', currentRoom: 'kitchen' }],
    };

    const nextState = runTick(state, startMs - 30_000);

    expect(nextState.lastTickTimestamp).toBe(startMs - 30_000);
    expect(nextState.resources).toEqual(state.resources);
  });
});
