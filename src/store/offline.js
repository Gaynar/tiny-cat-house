import { events as eventCatalog } from '../data/events.js';
import { tierFromScore } from '../data/relationships.js';
import { applySynergyDiary, calculateCatOutput } from './production.js';
import { processEvents } from './events.js';
import { processRelationshipTick } from './relationships.js';
import { processStateTransitions } from './transitions.js';

const CONFLICT_EVENT_IDS = new Set(['food_bowl_disagreement']);

function snapshotDiaryIds(state) {
  return new Set([
    ...state.diary.interactions.map((entry) => `interaction:${entry.id}`),
    ...state.diary.events.map((entry) => `event:${entry.id}`),
    ...state.diary.hints.map((entry) => `hint:${entry.id}`),
  ]);
}

function snapshotTiers(state) {
  const tiers = {};
  state.cats.forEach((cat) => {
    Object.entries(cat.relationships ?? {}).forEach(([otherId, value]) => {
      const key = [cat.id, otherId].sort().join(':');
      tiers[key] = tierFromScore(value.score ?? 0);
    });
  });
  return tiers;
}

function eventPriority(event, newDiaryIds) {
  if (event.isRare) return 0;
  if (event.tierChange) return 1;
  if (newDiaryIds.has(`event:${event.id}`)) return 2;
  if (CONFLICT_EVENT_IDS.has(event.id)) return 3;
  return 4;
}

const FIVE_MINUTES_MS = 5 * 60_000;
const HOUR_MS = 60 * 60_000;

function offlineCapHours(state) {
  const bedroom = state.rooms.find((room) => room.id === 'bedroom');
  if (bedroom?.furniture?.includes('moonlit_window')) {
    return 6;
  }

  if ((bedroom?.level ?? 1) >= 2) {
    return 5;
  }

  return 4;
}

function resourceStep(state, elapsedMs) {
  const elapsedMinutes = elapsedMs / 60_000;
  const gains = state.rooms.reduce(
    (totals, room) => {
      const catsInRoom = state.cats.filter((cat) => cat.currentRoom === room.id);
      return catsInRoom.reduce((catTotals, cat) => {
        const output = calculateCatOutput(cat, room, catsInRoom, state.cats, state.rooms, state);
        return {
          coins: catTotals.coins + output.coins * elapsedMinutes,
          comfort: catTotals.comfort + output.comfort * elapsedMinutes,
        };
      }, totals);
    },
    { coins: 0, comfort: 0 },
  );

  return {
    state: {
      ...state,
      resources: {
        coins: state.resources.coins + gains.coins,
        comfort: state.resources.comfort + gains.comfort,
      },
    },
    gains,
  };
}

function markBeanOfflineDislike(state, elapsedMs) {
  if (elapsedMs < FIVE_MINUTES_MS) {
    return state;
  }

  const bean = state.cats.find((cat) => cat.id === 'bean');
  if (!bean?.currentRoom) {
    return state;
  }

  const catsInRoom = state.cats.filter((cat) => cat.currentRoom === bean.currentRoom);
  if (catsInRoom.length !== 1) {
    return state;
  }

  return {
    ...state,
    cats: state.cats.map((cat) => (cat.id === 'bean' ? { ...cat, offlineAloneDislike: true } : cat)),
  };
}

export function simulateOffline(state, nowMs = Date.now()) {
  const elapsedMs = Math.max(0, nowMs - (state.lastTickTimestamp ?? nowMs));
  if (elapsedMs < FIVE_MINUTES_MS) {
    return { newState: state, summary: null };
  }

  const cappedElapsedMs = Math.min(elapsedMs, offlineCapHours(state) * HOUR_MS);
  const initialDiaryIds = snapshotDiaryIds(state);
  const initialTiers = snapshotTiers(state);
  let nextState = markBeanOfflineDislike(state, cappedElapsedMs);
  let cursor = state.lastTickTimestamp;
  let coinsEarned = 0;
  let comfortEarned = 0;
  const events = [];

  while (cursor < state.lastTickTimestamp + cappedElapsedMs) {
    const stepMs = Math.min(FIVE_MINUTES_MS, state.lastTickTimestamp + cappedElapsedMs - cursor);
    cursor += stepMs;
    const tiersBefore = snapshotTiers(nextState);
    nextState = processStateTransitions(nextState, cursor);
    const eventResult = processEvents(nextState, cursor, { offline: true });
    nextState = eventResult.newState;
    nextState = processRelationshipTick(nextState);
    nextState = applySynergyDiary(nextState, cursor);
    const tiersAfter = snapshotTiers(nextState);
    eventResult.firedEvents.forEach((event) => {
      const tierChange = Object.keys(tiersAfter).some((key) => tiersAfter[key] !== tiersBefore[key]);
      const definition = eventCatalog.find((entry) => entry.id === event.id);
      events.push({ ...event, flavor: event.flavor ?? definition?.flavor, tierChange });
    });
    const resourceResult = resourceStep(nextState, stepMs);
    nextState = resourceResult.state;
    coinsEarned += resourceResult.gains.coins;
    comfortEarned += resourceResult.gains.comfort;
  }

  const finalDiaryIds = snapshotDiaryIds(nextState);
  const newDiaryEntries = [...finalDiaryIds].filter((id) => !initialDiaryIds.has(id));
  const finalTiers = snapshotTiers(nextState);
  const relationshipChanges = Object.keys(finalTiers)
    .filter((key) => finalTiers[key] !== initialTiers[key])
    .map((key) => {
      const [catA, catB] = key.split(':');
      return { catA, catB, fromTier: initialTiers[key], toTier: finalTiers[key] };
    });

  const topEvents = [...events]
    .sort((a, b) => eventPriority(a, finalDiaryIds) - eventPriority(b, finalDiaryIds) || b.at - a.at)
    .slice(0, 5);

  return {
    newState: {
      ...nextState,
      lastTickTimestamp: nowMs,
      offlineEventQueue: topEvents,
    },
    summary: {
      elapsedMs,
      simulatedMs: cappedElapsedMs,
      coinsEarned,
      comfortEarned,
      events: topEvents,
      relationshipChanges,
      newDiaryEntries,
    },
  };
}
