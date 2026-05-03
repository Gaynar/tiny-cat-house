import { describe, expect, it } from 'vitest';
import { createInitialState } from '../initialState.js';
import { runTick } from '../tick.js';

function placeCats(state, placements) {
  return {
    ...state,
    cats: state.cats.map((cat) => {
      const room = placements[cat.id];
      return room ? { ...cat, currentRoom: room } : cat;
    }),
    resources: { coins: 10, comfort: 5 },
  };
}

describe('runTick', () => {
  it('adds production gains based on elapsed minutes', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      ...placeCats(createInitialState(), { miso: 'bedroom', mochi: 'kitchen' }),
      lastTickTimestamp: startMs,
      lastEventCheckAt: startMs,
    };

    const result = runTick(state, startMs + 120_000);

    expect(result.state.lastTickTimestamp).toBe(startMs + 120_000);
    expect(result.state.resources.coins).toBeCloseTo(10 + (0.3 + 3) * 2);
    expect(result.state.resources.comfort).toBeCloseTo(5 + 0.6 * 2);
  });

  it('does not subtract resources when time moves backwards', () => {
    const startMs = 1_700_000_000_000;
    const state = {
      ...placeCats(createInitialState(), { mochi: 'kitchen' }),
      lastTickTimestamp: startMs,
      lastEventCheckAt: startMs,
    };

    const result = runTick(state, startMs - 30_000);

    expect(result.state.lastTickTimestamp).toBe(startMs - 30_000);
    expect(result.state.resources).toEqual(state.resources);
  });

  it('preserves unrelated state values while replacing the resources object', () => {
    const startMs = 1_700_000_000_000;
    const initialState = createInitialState();
    const cats = initialState.cats;
    const rooms = initialState.rooms;
    const state = {
      ...initialState,
      lastTickTimestamp: startMs,
      lastEventCheckAt: startMs,
      resources: { coins: 10, comfort: 5 },
      settings: { soundEnabled: true },
    };

    const result = runTick(state, startMs + 60_000);

    expect(result.state).toMatchObject({
      version: 1,
      settings: { soundEnabled: true },
    });
    expect(result.state.cats).toEqual(cats);
    expect(result.state.rooms).toBe(rooms);
    expect(result.state.resources).not.toBe(state.resources);
  });
});
