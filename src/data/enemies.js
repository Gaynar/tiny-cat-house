const alleyRatStats = {
  maxHp: 12,
  maxMp: 0,
  attack: 4,
  defense: 1,
  speed: 3,
  luck: 1,
};

export const enemies = [
  {
    id: 'alley_rat',
    name: 'Alley Rat',
    family: 'rats',
    role: 'basic attacker',
    stats: alleyRatStats,
    intents: ['attack'],
    rewards: { xp: 4, fishbones: 3 },
  },
  {
    id: 'bold_pigeon',
    name: 'Bold Pigeon',
    family: 'birds',
    role: 'speed-focused nuisance',
    stats: {
      maxHp: 10,
      maxMp: 0,
      attack: 3,
      defense: 0,
      speed: 6,
      luck: 3,
    },
    intents: ['attack', 'apply_spooked'],
    rewards: { xp: 4, fishbones: 3 },
  },
  {
    id: 'tiny_dog',
    name: 'Tiny Dog',
    family: 'dogs',
    role: 'high attack with obvious intent',
    stats: {
      maxHp: 16,
      maxMp: 0,
      attack: 6,
      defense: 1,
      speed: 2,
      luck: 1,
    },
    intents: ['attack', 'strong_attack'],
    rewards: { xp: 6, fishbones: 4 },
  },
  {
    id: 'rival_tabby',
    name: 'Rival Tabby',
    family: 'rival_cats',
    role: 'balanced defender',
    stats: {
      maxHp: 18,
      maxMp: 4,
      attack: 5,
      defense: 2,
      speed: 4,
      luck: 2,
    },
    intents: ['attack', 'defend', 'apply_hungry'],
    rewards: { xp: 7, fishbones: 5 },
  },
  {
    id: 'bin_baron',
    name: 'Bin Baron',
    family: 'rats',
    role: 'first boss',
    isBoss: true,
    baseEnemyId: 'alley_rat',
    bossMultipliers: {
      hp: 3,
      damage: 1.5,
    },
    stats: {
      ...alleyRatStats,
      maxHp: alleyRatStats.maxHp * 3,
      attack: Math.ceil(alleyRatStats.attack * 1.5),
    },
    intents: ['attack', 'strong_attack', 'apply_wet'],
    rewards: { xp: 14, fishbones: 12, cannedTuna: 1 },
  },
];

export default enemies;
