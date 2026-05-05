export const roomUpgrades = {
  living_room: [
    {
      tier: 1,
      name: 'Sofa Springboard',
      cost: { fishbones: 12 },
      effect: { type: 'stat_bonus', stat: 'attack', value: 1 },
      description: '+1 Attack at the start of each night run.',
    },
  ],
  kitchen: [
    {
      tier: 1,
      name: 'Secret Tin Stash',
      cost: { fishbones: 10 },
      effect: { type: 'day_output_bonus', resource: 'cannedTuna', value: 1 },
      description: '+1 Canned Tuna when a day finishes.',
    },
  ],
  bedroom: [
    {
      tier: 1,
      name: 'Blanket Fort',
      cost: { fishbones: 14 },
      effect: { type: 'stat_bonus', stat: 'maxHp', value: 5 },
      description: '+5 Max HP at the start of each night run.',
    },
  ],
  storage_washing_room: [
    {
      tier: 1,
      name: 'Lucky Laundry Pile',
      cost: { fishbones: 12 },
      effect: { type: 'stat_bonus', stat: 'luck', value: 1 },
      description: '+1 Luck at the start of each night run.',
    },
  ],
  attic: [
    {
      tier: 1,
      name: 'Box Of Important Things',
      cost: { fishbones: 8 },
      effect: { type: 'placeholder', value: 'item_storage_later' },
      description: 'Placeholder for later prepared-item storage.',
    },
  ],
};

export default roomUpgrades;
