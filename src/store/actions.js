import { rooms as roomData } from '../data/rooms.js';
import { sampleTransitionDue } from './transitions.js';

export function catsInRoom(state, roomId) {
  return state.cats.filter((cat) => cat.currentRoom === roomId);
}

export function roomCapacity(roomOrId, state) {
  const roomId = typeof roomOrId === 'string' ? roomOrId : roomOrId?.id;
  const designRoom = roomData.find((room) => room.id === roomId);
  const savedRoom = state?.rooms?.find((room) => room.id === roomId) ?? (typeof roomOrId === 'object' ? roomOrId : null);
  const level = savedRoom?.level ?? 1;
  const baseCapacity = designRoom?.baseCapacity ?? 0;
  const maxCapacity = designRoom?.maxCapacity ?? baseCapacity;

  return Math.min(maxCapacity, baseCapacity + Math.max(0, level - 1));
}

export function assignCat(state, catId, roomId, nowMs = Date.now()) {
  const capacity = roomCapacity(roomId, state);
  if (catsInRoom(state, roomId).length >= capacity) {
    return { state, ok: false, reason: 'Room is full' };
  }

  return {
    ok: true,
    state: {
      ...state,
      cats: state.cats.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              currentRoom: roomId,
              currentState: 'active',
              stateEnteredAt: nowMs,
              stateTransitionDue: sampleTransitionDue('active', cat, nowMs),
              currentRoomEnteredAt: nowMs,
              currentSessionCounted: false,
              offlineAloneDislike: false,
            }
          : cat,
      ),
    },
  };
}

export function unassignCat(state, catId, nowMs = Date.now()) {
  return {
    ...state,
    cats: state.cats.map((cat) =>
      cat.id === catId
        ? {
            ...cat,
            currentRoom: null,
            currentState: 'active',
            stateEnteredAt: nowMs,
            stateTransitionDue: null,
            currentRoomEnteredAt: null,
            currentSessionCounted: false,
            offlineAloneDislike: false,
          }
        : cat,
    ),
  };
}
