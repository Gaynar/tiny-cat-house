import { describe, expect, it } from 'vitest';
import { DISLIKE_MULT, LIKE_MULT } from '../../data/modifiers.js';
import { findCat, findRoom } from '../production.js';
import {
  calculateCatOutput,
  calculateRoomOutput,
  isDislikeActive,
  isLikeActive,
} from '../production.js';

describe('production calculations', () => {
  it('applies Miso bedroom like multiplier', () => {
    const room = findRoom('bedroom');
    const miso = findCat('miso');

    expect(isLikeActive(miso, room, [miso])).toBe(true);
    expect(calculateCatOutput(miso, room, [miso])).toEqual({
      coins: room.baseRates.default.coins * LIKE_MULT,
      comfort: room.baseRates.default.comfort * LIKE_MULT,
    });
  });

  it('uses Mochi kitchen-alone base rates and like multiplier', () => {
    const room = findRoom('kitchen');
    const mochi = findCat('mochi');

    expect(isLikeActive(mochi, room, [mochi])).toBe(true);
    expect(calculateCatOutput(mochi, room, [mochi])).toEqual({
      coins: room.baseRates.mochi_alone.coins * LIKE_MULT,
      comfort: 0,
    });
  });

  it('uses Bean company base rates and like multiplier when not alone', () => {
    const room = findRoom('living_room');
    const bean = findCat('bean');
    const mochi = findCat('mochi');

    expect(isLikeActive(bean, room, [bean, mochi])).toBe(true);
    expect(calculateCatOutput(bean, room, [bean, mochi])).toEqual({
      coins: room.baseRates.bean_with_company.coins * LIKE_MULT,
      comfort: room.baseRates.bean_with_company.comfort * LIKE_MULT,
    });
  });

  it('applies crowded-room dislike before like bonuses', () => {
    const room = findRoom('living_room');
    const miso = findCat('miso');
    const bean = findCat('bean');

    expect(isDislikeActive(miso, room, [miso, bean])).toBe(true);
    expect(calculateCatOutput(miso, room, [miso, bean])).toEqual({
      coins: room.baseRates.calm_cat.coins * DISLIKE_MULT,
      comfort: room.baseRates.calm_cat.comfort * DISLIKE_MULT,
    });
  });

  it('sums all assigned cat output for a room', () => {
    const state = {
      cats: [
        { id: 'miso', currentRoom: 'living_room' },
        { id: 'bean', currentRoom: 'living_room' },
        { id: 'mochi', currentRoom: 'kitchen' },
      ],
    };

    expect(calculateRoomOutput(state, 'living_room').coins).toBeCloseTo(0.42 + 1.05);
    expect(calculateRoomOutput(state, 'living_room').comfort).toBeCloseTo(0.24 + 1.2);
  });

  it('returns zero output for an empty room', () => {
    expect(calculateRoomOutput({ cats: [] }, 'bedroom')).toEqual({ coins: 0, comfort: 0 });
  });
});
