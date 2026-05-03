import { describe, expect, it } from 'vitest';
import { assignCat, catsInRoom, roomCapacity, unassignCat } from '../actions.js';
import { createInitialState } from '../initialState.js';

describe('cat room actions', () => {
  it('reports cats assigned to a room and the base room capacity', () => {
    const state = {
      ...createInitialState(),
      cats: [
        { id: 'miso', currentRoom: 'living_room' },
        { id: 'bean', currentRoom: 'living_room' },
        { id: 'mochi', currentRoom: 'kitchen' },
      ],
    };

    expect(catsInRoom(state, 'living_room').map((cat) => cat.id)).toEqual(['miso', 'bean']);
    expect(roomCapacity('living_room')).toBe(2);
    expect(roomCapacity('unknown_room')).toBe(0);
  });

  it('assigns a cat to a room when there is capacity', () => {
    const nowMs = 1_700_000_000_000;
    const state = createInitialState();

    const result = assignCat(state, 'miso', 'bedroom', nowMs);

    expect(result.ok).toBe(true);
    expect(result.state.cats.find((cat) => cat.id === 'miso')).toMatchObject({
      currentRoom: 'bedroom',
      currentState: 'active',
      stateEnteredAt: nowMs,
      stateTransitionDue: null,
    });
    expect(state.cats.find((cat) => cat.id === 'miso').currentRoom).toBeNull();
  });

  it('rejects an assignment when the target room is full', () => {
    const state = {
      ...createInitialState(),
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'miso' || cat.id === 'bean' ? { ...cat, currentRoom: 'living_room' } : cat,
      ),
    };

    const result = assignCat(state, 'mochi', 'living_room');

    expect(result).toEqual({ state, ok: false, reason: 'Room is full' });
  });

  it('unassigns a cat and refreshes state timing', () => {
    const nowMs = 1_700_000_005_000;
    const state = {
      ...createInitialState(),
      cats: createInitialState().cats.map((cat) =>
        cat.id === 'bean' ? { ...cat, currentRoom: 'kitchen', currentState: 'sleeping' } : cat,
      ),
    };

    const nextState = unassignCat(state, 'bean', nowMs);

    expect(nextState.cats.find((cat) => cat.id === 'bean')).toMatchObject({
      currentRoom: null,
      currentState: 'active',
      stateEnteredAt: nowMs,
      stateTransitionDue: null,
    });
  });
});
