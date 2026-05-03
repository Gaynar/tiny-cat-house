import { describe, expect, it, vi } from 'vitest';
import { cats } from '../../data/cats.js';
import { rooms } from '../../data/rooms.js';
import { createInitialState } from '../initialState.js';

describe('createInitialState', () => {
  it('creates a complete playable state from design data', () => {
    const nowMs = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(nowMs);

    const state = createInitialState();

    expect(state).toMatchObject({
      version: 1,
      lastTickTimestamp: nowMs,
      resources: { coins: 0, comfort: 0 },
      eventCooldowns: {},
      offlineEventQueue: [],
      settings: { soundEnabled: false },
      tutorialStep: 0,
    });
    expect(state.cats).toHaveLength(cats.length);
    expect(state.rooms).toHaveLength(rooms.length);
    expect(state.cats.map((cat) => cat.id)).toEqual(cats.map((cat) => cat.id));
    expect(state.rooms.map((room) => room.id)).toEqual(rooms.map((room) => room.id));
    expect(state.diary.catProfiles.miso).toEqual({
      like: 'bedroom',
      dislike: 'crowded_room',
      discovered: true,
    });
  });

  it('initializes cat relationship and room session maps', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const state = createInitialState();
    const miso = state.cats.find((cat) => cat.id === 'miso');

    expect(Object.keys(miso.relationships).sort()).toEqual(['bean', 'mochi']);
    expect(miso.relationships.bean).toEqual({ score: 0 });
    expect(miso.roomSessions).toEqual({
      living_room: 0,
      kitchen: 0,
      bedroom: 0,
    });
  });

  it('creates discovered diary profiles for every cat without self relationships', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const state = createInitialState();

    expect(Object.keys(state.diary.catProfiles).sort()).toEqual(cats.map((cat) => cat.id).sort());
    expect(state.diary.interactions).toEqual([]);
    expect(state.diary.events).toEqual([]);
    expect(state.diary.hints).toEqual([]);

    state.cats.forEach((cat) => {
      expect(cat.relationships).not.toHaveProperty(cat.id);
      expect(state.diary.catProfiles[cat.id]).toMatchObject({
        like: cat.like,
        dislike: cat.dislike,
        discovered: true,
      });
    });
  });
});
