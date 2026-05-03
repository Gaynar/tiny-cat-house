import { cats as catData } from '../data/cats.js';
import { furniture as furnitureData } from '../data/furniture.js';
import { rooms as roomData } from '../data/rooms.js';
import { DISLIKE_MULT, LIKE_MULT, MULTIPLIER_CAP, SYNERGY_MULT } from '../data/modifiers.js';
import { STATE_EFFECTS } from '../data/states.js';
import { roomCapacity } from './actions.js';
import { unlockInteraction } from './diary.js';
import { getTier } from './relationships.js';

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

  if (room.id === 'bedroom' && cat.id === 'miso' && cat.currentState === 'sleeping') {
    return room.baseRates.miso_sleeping ?? room.baseRates.default;
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
    const capacity = roomCapacity(room, { rooms: [room] });
    return allCatsInRoom.length >= capacity && capacity > 1;
  }

  if (cat.dislike === 'alone_offline') {
    return Boolean(cat.offlineAloneDislike);
  }

  if (cat.dislike === 'grumpy_cat_nearby') {
    return allCatsInRoom.some((roomCat) => roomCat.id !== cat.id && roomCat.currentState === 'grumpy');
  }

  return false;
}

function appliesToCat(item, cat) {
  const appliesTo = item.effect?.appliesTo;
  return appliesTo === 'all' || !appliesTo || cat.traits?.includes(appliesTo);
}

function furnitureBonuses(savedRoom, cat) {
  return (savedRoom?.furniture ?? []).reduce(
    (bonus, furnitureId) => {
      const item = furnitureData.find((entry) => entry.id === furnitureId);
      if (!item || !appliesToCat(item, cat)) {
        return bonus;
      }

      if (item.effect.type === 'flat_coins') {
        return { ...bonus, coins: bonus.coins + item.effect.value };
      }

      if (item.effect.type === 'flat_comfort') {
        return { ...bonus, comfort: bonus.comfort + item.effect.value };
      }

      return bonus;
    },
    { coins: 0, comfort: 0 },
  );
}

function synergyMultiplier(cat, allCatsInRoom, state) {
  if (!state || cat.currentState === 'grumpy' || allCatsInRoom.some((roomCat) => roomCat.currentState === 'grumpy')) {
    return 1;
  }

  const hasRival = allCatsInRoom.some((roomCat) => {
    if (roomCat.id === cat.id) {
      return false;
    }
    return getTier(state, cat.id, roomCat.id) === 'rival';
  });

  if (hasRival) {
    return 1;
  }

  const hasFriendlyCompany = allCatsInRoom.some((roomCat) => {
    if (roomCat.id === cat.id) {
      return false;
    }

    const tier = getTier(state, cat.id, roomCat.id);
    return tier === 'friendly' || tier === 'bonded';
  });

  return hasFriendlyCompany ? SYNERGY_MULT : 1;
}

const SYNERGY_INTERACTIONS = [
  {
    id: 'nap_pile',
    matches: (state) => {
      const bedroomCats = state.cats.filter((cat) => cat.currentRoom === 'bedroom');
      const napping = bedroomCats.filter(
        (cat) =>
          (cat.currentState === 'resting' || cat.currentState === 'sleeping') &&
          (cat.traits?.includes('lazy') || cat.traits?.includes('calm')),
      );
      return napping.length >= 2;
    },
  },
  {
    id: 'friendly_company',
    matches: (state) => {
      for (const room of state.rooms) {
        const inRoom = state.cats.filter((cat) => cat.currentRoom === room.id);
        for (let index = 0; index < inRoom.length; index += 1) {
          for (let other = index + 1; other < inRoom.length; other += 1) {
            const tier = getTier(state, inRoom[index].id, inRoom[other].id);
            if (tier === 'friendly' || tier === 'bonded') {
              return true;
            }
          }
        }
      }
      return false;
    },
  },
  {
    id: 'kitchen_peace',
    matches: (state) => {
      const inKitchen = state.cats.filter((cat) => cat.currentRoom === 'kitchen');
      return inKitchen.length === 1 && inKitchen[0].traits?.includes('territorial');
    },
  },
];

export function applySynergyDiary(state, nowMs = Date.now()) {
  let nextState = state;

  for (const synergy of SYNERGY_INTERACTIONS) {
    const alreadyDiscovered = nextState.diary.interactions.some((entry) => entry.id === synergy.id);
    if (!alreadyDiscovered && synergy.matches(nextState)) {
      nextState = unlockInteraction(nextState, synergy.id, nowMs);
    }
  }

  return nextState;
}

export function calculateCatOutput(cat, room, allCatsInRoom, allCats = [], allRooms = [], state = null) {
  const designCat = { ...(findCat(cat.id) ?? {}), ...cat };
  const designRoom = findRoom(room.id) ?? room;
  const savedRoom = Array.isArray(allRooms) ? allRooms.find((entry) => entry.id === room.id) : null;
  const effectiveRoom = { ...designRoom, ...savedRoom };
  const base = baseRateFor(designCat, designRoom, allCatsInRoom);
  const flat = furnitureBonuses(savedRoom, designCat);
  let multiplier = 1;
  let coins = base.coins + flat.coins;
  let comfort = base.comfort + flat.comfort;

  if (isDislikeActive(designCat, effectiveRoom, allCatsInRoom)) {
    multiplier *= DISLIKE_MULT;
  } else if (isLikeActive(designCat, effectiveRoom, allCatsInRoom)) {
    multiplier *= LIKE_MULT;
  }

  multiplier *= synergyMultiplier(designCat, allCatsInRoom, state);
  const cappedMultiplier = Math.min(multiplier, MULTIPLIER_CAP);
  const stateEffect = STATE_EFFECTS[designCat.currentState] ?? STATE_EFFECTS.active;
  const hungryCoinsMod = designCat.currentState === 'hungry' && effectiveRoom.id !== 'kitchen' ? 1 : stateEffect.coinsMod;
  const lazySleepComfortMod =
    designCat.currentState === 'sleeping' && designCat.traits?.includes('lazy') ? 1.8 : 1;

  return {
    coins: coins * cappedMultiplier * hungryCoinsMod,
    comfort: comfort * cappedMultiplier * stateEffect.comfortMod * lazySleepComfortMod,
  };
}

export function calculateRoomOutput(state, roomId) {
  const room = findRoom(roomId);
  const savedRoom = state.rooms?.find((entry) => entry.id === roomId);
  const assignedCats = state.cats.filter((cat) => cat.currentRoom === roomId);

  return assignedCats.reduce(
    (total, cat) => {
      const output = calculateCatOutput(cat, { ...room, ...savedRoom }, assignedCats, state.cats, state.rooms, state);
      return {
        coins: total.coins + output.coins,
        comfort: total.comfort + output.comfort,
      };
    },
    { coins: 0, comfort: 0 },
  );
}
