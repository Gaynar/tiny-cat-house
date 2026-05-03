export const STATES = [
  'resting',
  'active',
  'playing',
  'hungry',
  'sleeping',
  'curious',
  'cuddly',
  'focused',
  'relaxed',
  'grumpy',
];

export const STATE_EFFECTS = {
  active: { coinsMod: 1, comfortMod: 1, notes: 'Baseline' },
  resting: { coinsMod: 0.7, comfortMod: 1.2, notes: '' },
  sleeping: { coinsMod: 0.3, comfortMod: 1.5, notes: 'Lazy cats: x1.8 Comfort' },
  focused: { coinsMod: 1.3, comfortMod: 1, notes: '' },
  cuddly: { coinsMod: 0.8, comfortMod: 1.4, notes: '' },
  relaxed: { coinsMod: 1.1, comfortMod: 1.2, notes: '' },
  grumpy: { coinsMod: 0.5, comfortMod: 0.5, notes: 'Suppresses synergies' },
  curious: { coinsMod: 1, comfortMod: 1, notes: 'Raises event check chance' },
  hungry: { coinsMod: 1.2, comfortMod: 0.8, notes: 'Coins modifier applies in Kitchen only' },
  playing: { coinsMod: 0.8, comfortMod: 1.1, notes: 'Raises toy-event chance' },
};

export const TRANSITIONS = [
  { from: 'active', to: 'resting', trigger: 'time', condition: 'same_room', durationMinutes: [20, 30] },
  { from: 'resting', to: 'sleeping', trigger: 'time', condition: 'resting; lazy cats use 8 minutes', durationMinutes: [15, 15] },
  { from: 'sleeping', to: 'active', trigger: 'time', condition: 'sleeping', durationMinutes: [30, 60] },
  { from: 'active', to: 'grumpy', trigger: 'event', condition: 'dislike_condition_active', durationMinutes: null },
  { from: 'grumpy', to: 'relaxed', trigger: 'time', condition: 'dislike_removed', durationMinutes: [15, 15] },
  { from: 'grumpy', to: 'relaxed', trigger: 'event', condition: 'quiet_corner_present', durationMinutes: null },
  { from: 'active', to: 'cuddly', trigger: 'event', condition: 'bonded_relationship_and_social_cat_nearby', durationMinutes: null },
  { from: 'active', to: 'focused', trigger: 'event', condition: 'liked_room_with_matching_furniture', durationMinutes: null },
  { from: 'any', to: 'hungry', trigger: 'time', condition: 'every_45_60_min; higher chance in Kitchen', durationMinutes: [45, 60] },
  { from: 'hungry', to: 'active', trigger: 'event', condition: 'food_related_furniture_present', durationMinutes: null },
  { from: 'active', to: 'curious', trigger: 'event', condition: 'playful_or_mischievous_discovery_check', durationMinutes: null },
  { from: 'sleeping', to: 'grumpy', trigger: 'event', condition: 'playful_cat_interrupts_sleep', durationMinutes: null },
];
