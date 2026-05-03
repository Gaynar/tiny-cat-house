import { cats as catData } from '../data/cats.js';
import { rooms as roomData } from '../data/rooms.js';
import { DISLIKE_MULT, LIKE_MULT, MULTIPLIER_CAP } from '../data/modifiers.js';

export function findCat(catId) {
  return catData.find((cat) => cat.id === catId);
}

export function findRoom(roomId) {
  return roomData.find((room) => room.id === roomId);
}

function baseRateFor(cat, room, allCatsInRoom) {
  if (!cat || !room) {
    return { coins: 0, comfort: 0 };
  }

  if (room.id === 'kitchen' && cat.id === 'mochi' && allCatsInRoom.length === 1) {
    return room.baseRates.mochi_alone;
  }

  if (room.id === 'living_room' && cat.id === 'bean' && allCatsInRoom.length >= 2) {
    return room.baseRates.bean_with_company;
  }

  if (room.id === 'living_room' && cat.traits.includes('calm')) {
    return room.baseRates.calm_cat;
  }

  return room.baseRates.default;
}

export function isLikeActive(cat, room, allCatsInRoom) {
  if (cat.like === 'bedroom') {
    return room.id === 'bedroom';
  }

  if (cat.like === 'company') {
    return allCatsInRoom.length >= 2;
  }

  if (cat.like === 'alone_kitchen') {
    return room.id === 'kitchen' && allCatsInRoom.length === 1;
  }

  return false;
}

export function isDislikeActive(cat, room, allCatsInRoom) {
  if (cat.dislike === 'crowded_room') {
    return allCatsInRoom.length === room.baseCapacity && room.baseCapacity > 1;
  }

  return false;
}

export function calculateCatOutput(cat, room, allCatsInRoom) {
  const designCat = findCat(cat.id) ?? cat;
  const designRoom = findRoom(room.id) ?? room;
  const base = baseRateFor(designCat, designRoom, allCatsInRoom);
  let multiplier = 1;

  if (isDislikeActive(designCat, designRoom, allCatsInRoom)) {
    multiplier *= DISLIKE_MULT;
  } else if (isLikeActive(designCat, designRoom, allCatsInRoom)) {
    multiplier *= LIKE_MULT;
  }

  const cappedMultiplier = Math.min(multiplier, MULTIPLIER_CAP);

  return {
    coins: base.coins * cappedMultiplier,
    comfort: base.comfort * cappedMultiplier,
  };
}

export function calculateRoomOutput(state, roomId) {
  const room = findRoom(roomId);
  const assignedCats = state.cats.filter((cat) => cat.currentRoom === roomId);

  return assignedCats.reduce(
    (total, cat) => {
      const output = calculateCatOutput(cat, room, assignedCats, state.cats, roomData);
      return {
        coins: total.coins + output.coins,
        comfort: total.comfort + output.comfort,
      };
    },
    { coins: 0, comfort: 0 },
  );
}
