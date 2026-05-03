import { rooms as roomData } from '../data/rooms.js';
import { processEvents, forcePostTutorialEvent } from './events.js';
import { applySynergyDiary, calculateCatOutput } from './production.js';
import { processRoomSessions } from './diary.js';
import { processRelationshipTick } from './relationships.js';
import { processStateTransitions } from './transitions.js';

export function runTick(state, nowMs) {
  const elapsedMs = Math.max(0, nowMs - state.lastTickTimestamp);
  const elapsedMinutes = elapsedMs / 60000;
  let nextState = processStateTransitions(state, nowMs);
  const firedEvents = [];

  if (nextState.pendingPostTutorialEvent && !nextState.postTutorialEventFired) {
    const tutorialResult = forcePostTutorialEvent(nextState, nowMs);
    nextState = tutorialResult.state;
    firedEvents.push(...tutorialResult.firedEvents);
  }

  const eventResult = processEvents(nextState, nowMs);
  nextState = eventResult.newState;
  firedEvents.push(...eventResult.firedEvents);

  if (nowMs - (state.lastEventCheckAt ?? state.lastTickTimestamp) >= 5 * 60_000) {
    nextState = processRelationshipTick(nextState);
  }

  const gains = roomData.reduce(
    (roomTotals, room) => {
      const savedRoom = nextState.rooms?.find((entry) => entry.id === room.id);
      const catsInRoom = nextState.cats.filter((cat) => cat.currentRoom === room.id);
      const roomOutput = catsInRoom.reduce(
        (catTotals, cat) => {
          const output = calculateCatOutput(cat, { ...room, ...savedRoom }, catsInRoom, nextState.cats, nextState.rooms, nextState);
          return {
            coins: catTotals.coins + output.coins,
            comfort: catTotals.comfort + output.comfort,
          };
        },
        { coins: 0, comfort: 0 },
      );

      return {
        coins: roomTotals.coins + roomOutput.coins,
        comfort: roomTotals.comfort + roomOutput.comfort,
      };
    },
    { coins: 0, comfort: 0 },
  );

  nextState = applySynergyDiary(nextState, nowMs);
  nextState = processRoomSessions(nextState, nowMs);

  return {
    state: {
      ...nextState,
      lastTickTimestamp: nowMs,
      resources: {
        coins: nextState.resources.coins + gains.coins * elapsedMinutes,
        comfort: nextState.resources.comfort + gains.comfort * elapsedMinutes,
      },
    },
    firedEvents,
  };
}
