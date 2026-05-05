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
    vi.stubGlobal('localStorage', createLocalStorageMock());
  });

  it('uses the Hector save key', () => {
    expect(SAVE_KEY).toBe('hectorsAdventure_save');
  });

  it('saves the full game state to localStorage', () => {
    const state = {
      version: 1,
      resources: { fishbones: 12, cannedTuna: 4 },
    };

    saveGame(state);

    expect(localStorage.setItem).toHaveBeenCalledWith(SAVE_KEY, JSON.stringify(state));
  });

  it('loads a fresh state when there is no save', () => {
    const state = loadGame();

    expect(localStorage.getItem).toHaveBeenCalledWith(SAVE_KEY);
    expect(state.version).toBe(1);
    expect(state.resources).toEqual({ fishbones: 0, cannedTuna: 0 });
    expect(state.hector.id).toBe('hector');
  });

  it('merges saved data into current defaults by object id', () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        day: 4,
        resources: { fishbones: 25 },
        house: {
          rooms: [{ id: 'kitchen', upgradeTier: 1 }],
        },
        settings: { soundEnabled: true },
        newFieldFromSave: 'kept',
      }),
    );

    const state = loadGame();

    expect(state.day).toBe(4);
    expect(state.resources).toEqual({ fishbones: 25, cannedTuna: 0 });
    expect(state.settings.soundEnabled).toBe(true);
    expect(state.newFieldFromSave).toBe('kept');
    expect(state.house.rooms.find((room) => room.id === 'kitchen').upgradeTier).toBe(1);
    expect(state.house.rooms.find((room) => room.id === 'bedroom')).toMatchObject({
      id: 'bedroom',
      upgradeTier: 0,
    });
  });

  it('falls back to a fresh state when saved JSON is invalid', () => {
    localStorage.getItem.mockReturnValue('not-json');

    const state = loadGame();

    expect(state.resources).toEqual({ fishbones: 0, cannedTuna: 0 });
    expect(state.hector.id).toBe('hector');
  });

  it('removes the stored save', () => {
    resetSave();

    expect(localStorage.removeItem).toHaveBeenCalledWith(SAVE_KEY);
  });
});
