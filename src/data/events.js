export const events = [
  {
    id: 'rattling_bin',
    title: 'Rattling Bin',
    zone: 'back_alley',
    flavor: 'Something excellent or terrible is making the bin lid wobble.',
    choices: [
      {
        id: 'investigate',
        label: 'Investigate',
        outcome: { type: 'resource_gain', resources: { fishbones: 4 } },
      },
      {
        id: 'keep_distance',
        label: 'Keep Distance',
        outcome: { type: 'heal', hp: 3 },
      },
    ],
  },
  {
    id: 'rain_puddle_shortcut',
    title: 'Rain Puddle Shortcut',
    zone: 'back_alley',
    flavor: 'A shortcut glimmers behind a deeply suspicious puddle.',
    choices: [
      {
        id: 'dash_through',
        label: 'Dash Through',
        outcome: { type: 'resource_gain_with_status', resources: { fishbones: 6 }, statusId: 'wet' },
      },
      {
        id: 'walk_around',
        label: 'Walk Around',
        outcome: { type: 'resource_gain', resources: { fishbones: 2 } },
      },
    ],
  },
  {
    id: 'friendly_window',
    title: 'Friendly Window',
    zone: 'back_alley',
    flavor: 'A warm kitchen window opens just enough for a heroic snack.',
    choices: [
      {
        id: 'accept_snack',
        label: 'Accept Snack',
        outcome: { type: 'resource_gain', resources: { cannedTuna: 1 } },
      },
      {
        id: 'save_the_moment',
        label: 'Save The Moment',
        outcome: { type: 'mp_restore', mp: 3 },
      },
    ],
  },
  {
    id: 'cardboard_fortress',
    title: 'Cardboard Fortress',
    zone: 'back_alley',
    flavor: 'A cardboard box offers tactical superiority and excellent corners.',
    choices: [
      {
        id: 'ambush_practice',
        label: 'Ambush Practice',
        outcome: { type: 'temporary_stat_bonus', stat: 'attack', value: 1, battles: 1 },
      },
      {
        id: 'rest_inside',
        label: 'Rest Inside',
        outcome: { type: 'heal', hp: 5 },
      },
    ],
  },
  {
    id: 'distant_bark',
    title: 'Distant Bark',
    zone: 'back_alley',
    flavor: 'A tiny dog announces itself from somewhere it cannot possibly fit.',
    choices: [
      {
        id: 'stand_ground',
        label: 'Stand Ground',
        outcome: { type: 'resource_gain', resources: { fishbones: 5 } },
      },
      {
        id: 'strategic_hide',
        label: 'Strategic Hide',
        outcome: { type: 'apply_status', statusId: 'spooked' },
      },
    ],
  },
  {
    id: 'moonlit_fence',
    title: 'Moonlit Fence',
    zone: 'back_alley',
    flavor: 'The fence route is narrow, dramatic, and probably worth it.',
    choices: [
      {
        id: 'balance_across',
        label: 'Balance Across',
        outcome: { type: 'resource_gain', resources: { fishbones: 4 }, luckBonus: true },
      },
      {
        id: 'hop_down',
        label: 'Hop Down',
        outcome: { type: 'mp_restore', mp: 2 },
      },
    ],
  },
];

export default events;
