import { rooms as roomData } from '../data/rooms.js';
import { calculateCatOutput } from './production.js';

export function runTick(state, nowMs) {
  const elapsedMs = Math.max(0, nowMs - state.lastTickTimestamp);
  const elapsedMinutes = elapsedMs / 60000;

  const gains = roomData.reduce(
    (roomTotals, room) => {
      const catsInRoom = state.cats.filter((cat) => cat.currentRoom === room.id);
      const roomOutput = catsInRoom.reduce(
        (catTotals, cat) => {
          const output = calculateCatOutput(cat, room, catsInRoom, state.cats, roomData);
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

  return {
    ...state,
    lastTickTimestamp: nowMs,
    resources: {
      coins: state.resources.coins + gains.coins * elapsedMinutes,
      comfort: state.resources.comfort + gains.comfort * elapsedMinutes,
    },
  };
}
