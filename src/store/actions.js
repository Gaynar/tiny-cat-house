import { rooms as roomData } from '../data/rooms.js';

export function catsInRoom(state, roomId) {
  return state.cats.filter((cat) => cat.currentRoom === roomId);
}

export function roomCapacity(roomId) {
  return roomData.find((room) => room.id === roomId)?.baseCapacity ?? 0;
}

export function assignCat(state, catId, roomId, nowMs = Date.now()) {
  const capacity = roomCapacity(roomId);
  if (catsInRoom(state, roomId).length >= capacity) {
    return { state, ok: false, reason: 'Room is full' };
  }

  return {
    ok: true,
    state: {
      ...state,
      cats: state.cats.map((cat) =>
        cat.id === catId
          ? { ...cat, currentRoom: roomId, currentState: 'active', stateEnteredAt: nowMs, stateTransitionDue: null }
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
        ? { ...cat, currentRoom: null, currentState: 'active', stateEnteredAt: nowMs, stateTransitionDue: null }
        : cat,
    ),
  };
}
