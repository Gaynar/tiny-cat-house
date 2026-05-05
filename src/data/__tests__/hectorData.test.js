import { describe, expect, it } from 'vitest';
import { fighterAbilities } from '../abilities.js';
import { enemies } from '../enemies.js';
import { events } from '../events.js';
import { hector } from '../hector.js';
import { houseRooms } from '../houseRooms.js';
import { nodeTypes } from '../nodes.js';
import { resources } from '../resources.js';
import { roomUpgrades } from '../roomUpgrades.js';
import { statuses } from '../statuses.js';

describe('Hector static data', () => {
  it('defines only the MVP resources from the GDD', () => {
    expect(Object.keys(resources)).toEqual(['fishbones', 'cannedTuna']);
    expect(resources.fishbones.role).toBe('room_upgrades');
    expect(resources.cannedTuna.role).toBe('healing_preparation');
  });

  it('defines Hector as the Fighter MVP character', () => {
    expect(hector).toMatchObject({
      id: 'hector',
      classId: 'fighter',
      startingStats: {
        maxHp: 30,
        maxMp: 10,
        attack: 5,
        defense: 2,
        speed: 4,
        luck: 3,
      },
    });
  });

  it('defines the five fixed terraced-house rooms and first upgrades', () => {
    expect(houseRooms.map((room) => room.id)).toEqual([
      'attic',
      'bedroom',
      'storage_washing_room',
      'living_room',
      'kitchen',
    ]);

    for (const room of houseRooms) {
      expect(roomUpgrades[room.id]?.[0]).toMatchObject({ tier: 1 });
    }
  });

  it('defines Fighter abilities, statuses, node types, and Back Alley events', () => {
    expect(fighterAbilities).toHaveLength(10);
    expect(Object.keys(statuses)).toEqual(['wet', 'hungry', 'spooked']);
    expect(Object.keys(nodeTypes)).toEqual(['combat', 'event', 'rest', 'shop', 'elite', 'boss']);
    expect(nodeTypes.shop.enabled).toBe(false);
    expect(events.length).toBeGreaterThanOrEqual(4);
    expect(events.length).toBeLessThanOrEqual(6);
  });

  it('defines Bin Baron as a boss derived from Alley Rat multipliers', () => {
    const alleyRat = enemies.find((enemy) => enemy.id === 'alley_rat');
    const binBaron = enemies.find((enemy) => enemy.id === 'bin_baron');

    expect(binBaron).toMatchObject({
      isBoss: true,
      baseEnemyId: 'alley_rat',
      bossMultipliers: { hp: 3, damage: 1.5 },
    });
    expect(binBaron.stats.maxHp).toBe(alleyRat.stats.maxHp * 3);
    expect(binBaron.stats.attack).toBe(Math.ceil(alleyRat.stats.attack * 1.5));
  });
});
