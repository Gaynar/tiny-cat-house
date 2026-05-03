export const HINT_INTERACTION = {
  bedroom: 'nap_pile',
  living_room: 'friendly_company',
  kitchen: 'kitchen_peace',
};

export const DIARY_CATALOG = {
  interactions: [
    { id: 'nap_pile', title: 'Nap Pile', hint: 'Two gentle cats might discover it in the Bedroom.' },
    { id: 'friendly_company', title: 'Friendly Company', hint: 'Some cats work better when they are not alone.' },
    { id: 'kitchen_peace', title: 'Kitchen Peace', hint: 'A territorial cat may prefer a quiet Kitchen.' },
  ],
  events: [
    { id: 'hidden_toy', title: 'Hidden Toy', hint: 'A playful cat can discover this while active.' },
    { id: 'stolen_snack', title: 'Stolen Snack', hint: 'A food-minded cat in the Kitchen may find this.' },
    { id: 'shared_sunbeam', title: 'Shared Sunbeam', hint: 'Resting cats sometimes share warmth.' },
    { id: 'quiet_afternoon', title: 'Quiet Afternoon', hint: 'A calm cat can soften the Living Room.' },
    { id: 'food_bowl_disagreement', title: 'Food Bowl Disagreement', hint: 'The Kitchen can become tense with company.' },
    { id: 'midnight_playtime', title: 'Midnight Playtime', hint: 'Some discoveries only happen while away.' },
    { id: 'unexpected_nap_pile', title: 'Unexpected Nap Pile', hint: 'Sleepy company can become a memory.' },
    { id: 'new_favorite_spot', title: 'New Favorite Spot', hint: 'Repeated time in a furnished room can unlock this.' },
  ],
  hints: [
    { id: 'miso_bedroom_hint', title: 'Miso and the Bedroom', hint: 'Let Miso spend two full sessions in the Bedroom.' },
    { id: 'bean_living_room_hint', title: 'Bean and Company', hint: 'Let Bean spend two full sessions in the Living Room.' },
    { id: 'mochi_kitchen_hint', title: 'Mochi and the Kitchen', hint: 'Let Mochi spend two full sessions in the Kitchen.' },
  ],
};

function hasEntry(entries, id) {
  return entries.some((entry) => entry.id === id);
}

export function unlockInteraction(state, id, nowMs = Date.now()) {
  if (hasEntry(state.diary.interactions, id)) {
    return state;
  }

  return {
    ...state,
    diary: {
      ...state.diary,
      interactions: [...state.diary.interactions, { id, discoveredAt: nowMs }],
    },
  };
}

export function unlockEvent(state, id, nowMs = Date.now()) {
  if (hasEntry(state.diary.events, id)) {
    return state;
  }

  return {
    ...state,
    diary: {
      ...state.diary,
      events: [...state.diary.events, { id, discoveredAt: nowMs }],
    },
  };
}

export function unlockHint(state, id, catId, roomId, nowMs = Date.now()) {
  if (hasEntry(state.diary.hints, id)) {
    return state;
  }

  return {
    ...state,
    diary: {
      ...state.diary,
      hints: [...state.diary.hints, { id, catId, roomId, discoveredAt: nowMs }],
    },
  };
}

export function processRoomSessions(state, nowMs = Date.now()) {
  let nextState = state;

  const cats = state.cats.map((cat) => {
    if (!cat.currentRoom || !cat.currentRoomEnteredAt) {
      return { ...cat, currentSessionCounted: false };
    }

    const elapsed = nowMs - cat.currentRoomEnteredAt;
    if (elapsed < 5 * 60_000 || cat.currentSessionCounted) {
      return cat;
    }

    const roomSessions = {
      ...cat.roomSessions,
      [cat.currentRoom]: (cat.roomSessions?.[cat.currentRoom] ?? 0) + 1,
    };

    const sessionCat = { ...cat, roomSessions, currentSessionCounted: true };
    if (roomSessions[cat.currentRoom] >= 2) {
      const interactionId = HINT_INTERACTION[cat.currentRoom];
      const interactionDiscovered = nextState.diary.interactions.some((entry) => entry.id === interactionId);
      if (interactionId && !interactionDiscovered) {
        const hintId = `${cat.id}_${cat.currentRoom}_hint`;
        nextState = unlockHint(nextState, hintId, cat.id, cat.currentRoom, nowMs);
      }
    }

    return sessionCat;
  });

  return { ...nextState, cats };
}
