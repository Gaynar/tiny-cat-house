export const statuses = {
  wet: {
    id: 'wet',
    name: 'Wet',
    description: 'Reduced Speed for a short time.',
    effect: { type: 'stat_multiplier', stat: 'speed', value: 0.75 },
    defaultDuration: 2,
  },
  hungry: {
    id: 'hungry',
    name: 'Hungry',
    description: 'Reduced Attack for a short time.',
    effect: { type: 'stat_multiplier', stat: 'attack', value: 0.8 },
    defaultDuration: 2,
  },
  spooked: {
    id: 'spooked',
    name: 'Spooked',
    description: 'Chance to miss while scuffling.',
    effect: { type: 'miss_chance', value: 0.25 },
    defaultDuration: 2,
  },
};

export default statuses;
