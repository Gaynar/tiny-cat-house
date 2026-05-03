import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SAVE_KEY, loadGame, resetSave, saveGame } from '../persistence.js';

function createLocalStorageMock() {
  const store = new Map();

  return {
    getItem: vi.fn((key) => store.get(key) ?? null),
    removeItem: vi.fn((key) => {
      store.delete(key);
    }),
    setItem: vi.fn((key, value) => {
      store.set(key, value);
    }),
  };
}

describe('persistence', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
    vi.stubGlobal('localStorage', createLocalStorageMock());
  });

  it('saves the full game state to localStorage', () => {
    const state = {
      version: 1,
      resources: { coins: 12, comfort: 4 },
    };

    saveGame(state);

    expect(localStorage.setItem).toHaveBeenCalledWith(SAVE_KEY, JSON.stringify(state));
  });

  it('loads a fresh state when there is no save', () => {
    const state = loadGame();

    expect(localStorage.getItem).toHaveBeenCalledWith(SAVE_KEY);
    expect(state.resources).toEqual({ coins: 0, comfort: 0 });
    expect(state.cats.find((cat) => cat.id === 'miso').currentRoom).toBeNull();
  });

  it('merges saved data into current defaults by object id', () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        resources: { coins: 25 },
        cats: [
          {
            id: 'miso',
            currentRoom: 'bedroom',
            relationships: { bean: { score: 7 } },
          },
        ],
        rooms: [{ id: 'kitchen', level: 2 }],
        settings: { soundEnabled: true },
        newFieldFromSave: 'kept',
      }),
    );

    const state = loadGame();

    expect(state.resources).toEqual({ coins: 25, comfort: 0 });
    expect(state.settings.soundEnabled).toBe(true);
    expect(state.newFieldFromSave).toBe('kept');
    expect(state.cats.find((cat) => cat.id === 'miso')).toMatchObject({
      currentRoom: 'bedroom',
      relationships: {
        bean: { score: 7 },
        mochi: { score: 0 },
      },
    });
    expect(state.cats.find((cat) => cat.id === 'bean')).toMatchObject({
      id: 'bean',
      currentRoom: null,
    });
    expect(state.rooms.find((room) => room.id === 'kitchen').level).toBe(2);
  });

  it('replaces saved non-id arrays while preserving default arrays when saved data is malformed', () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        diary: {
          interactions: [{ id: 'first-pet', catId: 'miso' }],
          events: 'not-an-array',
        },
        offlineEventQueue: [{ id: 'queued-event' }],
      }),
    );

    const state = loadGame();

    expect(state.diary.interactions).toEqual([{ id: 'first-pet', catId: 'miso' }]);
    expect(state.diary.events).toEqual([]);
    expect(state.offlineEventQueue).toEqual([{ id: 'queued-event' }]);
  });

  it('falls back to a fresh state when saved JSON is invalid', () => {
    localStorage.getItem.mockReturnValue('not-json');

    const state = loadGame();

    expect(state.resources).toEqual({ coins: 0, comfort: 0 });
    expect(state.cats.map((cat) => cat.id)).toEqual(['miso', 'bean', 'mochi']);
  });

  it('removes the stored save', () => {
    resetSave();

    expect(localStorage.removeItem).toHaveBeenCalledWith(SAVE_KEY);
  });
});
