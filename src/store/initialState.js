const HOUSE_ROOMS = [
  {
    id: 'attic',
    name: 'Attic',
    floor: 3,
    activity: 'Storage',
    effect: 'Prepared item storage later',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    floor: 2,
    activity: 'Nap',
    effect: '+5 Max HP when upgraded',
  },
  {
    id: 'storage_washing_room',
    name: 'Storage/Washing Room',
    floor: 2,
    activity: 'Litterbox',
    effect: '+1 Luck when upgraded',
  },
  {
    id: 'living_room',
    name: 'Living Room',
    floor: 1,
    activity: 'Play',
    effect: '+1 Attack when upgraded',
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    floor: 1,
    activity: 'Eat',
    effect: '+1 Canned Tuna per day when upgraded',
  },
];

export function createInitialState() {
  return {
    version: 1,
    day: 1,
    phase: 'day',
    resources: {
      fishbones: 0,
      cannedTuna: 0,
    },
    house: {
      rooms: HOUSE_ROOMS.map((room) => ({
        ...room,
        unlocked: true,
        upgradeTier: 0,
      })),
    },
    hector: {
      id: 'hector',
      name: 'Hector',
      classId: 'fighter',
      summary: 'Sweet and cute during the day, tough after dark.',
      stats: {
        maxHp: 30,
        maxMp: 10,
        attack: 5,
        defense: 2,
        speed: 4,
        luck: 3,
      },
    },
    currentRun: null,
    settings: {
      soundEnabled: false,
    },
  };
}
