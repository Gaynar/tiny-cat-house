export const nodeTypes = {
  combat: {
    id: 'combat',
    name: 'Combat',
    purpose: 'Normal battle and XP.',
    enabled: true,
  },
  event: {
    id: 'event',
    name: 'Event',
    purpose: 'Choice or short outcome.',
    enabled: true,
  },
  rest: {
    id: 'rest',
    name: 'Rest',
    purpose: 'Heal or recover MP.',
    enabled: true,
  },
  shop: {
    id: 'shop',
    name: 'Shop',
    purpose: 'Placeholder for later purchases.',
    enabled: false,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    purpose: 'Harder combat with better rewards.',
    enabled: true,
  },
  boss: {
    id: 'boss',
    name: 'Boss',
    purpose: 'Final fight of the night.',
    enabled: true,
  },
};

export const nightNodeOrder = ['combat', 'event', 'rest', 'shop', 'elite', 'boss'];

export default nodeTypes;
