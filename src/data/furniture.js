export const furniture = [
  {
    id: 'soft_sofa',
    name: 'Soft Sofa',
    roomId: 'living_room',
    cost: { coins: 240, comfort: 0 },
    effect: { type: 'flat_comfort', value: 1, appliesTo: 'social' },
  },
  {
    id: 'tall_cat_tree',
    name: 'Tall Cat Tree',
    roomId: 'living_room',
    cost: { coins: 450, comfort: 60 },
    effect: { type: 'flat_comfort', value: 1, appliesTo: 'curious' },
  },
  {
    id: 'toy_basket',
    name: 'Toy Basket',
    roomId: 'living_room',
    cost: { coins: 360, comfort: 0 },
    effect: { type: 'flat_comfort', value: 1, appliesTo: 'playful' },
  },
  {
    id: 'extra_food_bowls',
    name: 'Extra Food Bowls',
    roomId: 'kitchen',
    cost: { coins: 300, comfort: 0 },
    effect: { type: 'flat_coins', value: 2, appliesTo: 'greedy', removesConflict: 'food_bowl_disagreement' },
  },
  {
    id: 'treat_cabinet',
    name: 'Treat Cabinet',
    roomId: 'kitchen',
    cost: { coins: 540, comfort: 0 },
    effect: { type: 'flat_coins', value: 2, appliesTo: 'greedy' },
  },
  {
    id: 'countertop_expansion',
    name: 'Countertop Expansion',
    roomId: 'kitchen',
    cost: { coins: 900, comfort: 0 },
    effect: { type: 'capacity_pressure_relief', value: 1, appliesTo: 'territorial' },
  },
  {
    id: 'heated_blanket',
    name: 'Heated Blanket',
    roomId: 'bedroom',
    cost: { coins: 270, comfort: 30 },
    effect: { type: 'flat_comfort', value: 1, appliesTo: 'lazy' },
  },
  {
    id: 'quiet_corner',
    name: 'Quiet Corner',
    roomId: 'bedroom',
    cost: { coins: 390, comfort: 60 },
    effect: { type: 'state_recovery', state: 'grumpy', durationMinutes: 8, appliesTo: 'all' },
  },
  {
    id: 'moonlit_window',
    name: 'Moonlit Window',
    roomId: 'bedroom',
    cost: { coins: 750, comfort: 90 },
    effect: { type: 'offline_cap_hours', value: 6, appliesTo: 'bedroom' },
  },
  {
    id: 'quiet_cubby',
    name: 'Quiet Cubby',
    roomId: 'bedroom',
    cost: { coins: 390, comfort: 60 },
    effect: { type: 'flat_comfort', value: 1, appliesTo: 'territorial' },
  },
];

export default furniture;
