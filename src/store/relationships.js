import { SCORE_CEILING, SCORE_FLOOR, tierFromScore } from '../data/relationships.js';

const POSITIVE_STATES = new Set(['relaxed', 'cuddly', 'focused']);

function clampScore(score) {
  return Math.min(SCORE_CEILING, Math.max(SCORE_FLOOR, score));
}

function updateOneRelationship(cat, otherId, delta) {
  const current = cat.relationships?.[otherId]?.score ?? 0;
  return {
    ...cat,
    relationships: {
      ...cat.relationships,
      [otherId]: { score: clampScore(current + delta) },
    },
  };
}

export function adjustRelationship(state, catAId, catBId, delta) {
  if (catAId === catBId) {
    return state;
  }

  return {
    ...state,
    cats: state.cats.map((cat) => {
      if (cat.id === catAId) {
        return updateOneRelationship(cat, catBId, delta);
      }

      if (cat.id === catBId) {
        return updateOneRelationship(cat, catAId, delta);
      }

      return cat;
    }),
  };
}

export function getTier(state, catAId, catBId) {
  const cat = state.cats.find((entry) => entry.id === catAId);
  return tierFromScore(cat?.relationships?.[catBId]?.score ?? 0);
}

export function processRelationshipTick(state) {
  let nextState = state;

  state.rooms.forEach((room) => {
    const catsInRoom = nextState.cats.filter((cat) => cat.currentRoom === room.id);
    for (let index = 0; index < catsInRoom.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < catsInRoom.length; otherIndex += 1) {
        const first = catsInRoom[index];
        const second = catsInRoom[otherIndex];
        if (first.currentState === 'grumpy' || second.currentState === 'grumpy') {
          nextState = adjustRelationship(nextState, first.id, second.id, -1);
        } else if (POSITIVE_STATES.has(first.currentState) && POSITIVE_STATES.has(second.currentState)) {
          nextState = adjustRelationship(nextState, first.id, second.id, 1);
        }
      }
    }
  });

  return nextState;
}
