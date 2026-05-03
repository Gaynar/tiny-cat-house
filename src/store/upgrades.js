import { furniture as furnitureData } from '../data/furniture.js';
import { rooms as roomData } from '../data/rooms.js';

export function canAfford(resources, cost) {
  return (resources.coins ?? 0) >= (cost.coins ?? 0) && (resources.comfort ?? 0) >= (cost.comfort ?? 0);
}

export function furnitureSlotsFor(room) {
  const designRoom = roomData.find((entry) => entry.id === room.id) ?? room;
  return designRoom.furnitureSlots?.[room.level ?? 1] ?? 0;
}

export function purchaseFurniture(state, roomId, furnitureId) {
  const item = furnitureData.find((entry) => entry.id === furnitureId && entry.roomId === roomId);
  const savedRoom = state.rooms.find((room) => room.id === roomId);

  if (!item || !savedRoom || savedRoom.furniture.includes(furnitureId)) {
    return null;
  }

  if (!canAfford(state.resources, item.cost) || savedRoom.furniture.length >= furnitureSlotsFor(savedRoom)) {
    return null;
  }

  return {
    ...state,
    resources: {
      coins: state.resources.coins - (item.cost.coins ?? 0),
      comfort: state.resources.comfort - (item.cost.comfort ?? 0),
    },
    rooms: state.rooms.map((room) =>
      room.id === roomId ? { ...room, furniture: [...room.furniture, furnitureId] } : room,
    ),
  };
}

export function upgradeRoom(state, roomId) {
  const savedRoom = state.rooms.find((room) => room.id === roomId);
  const designRoom = roomData.find((room) => room.id === roomId);
  const nextLevel = (savedRoom?.level ?? 1) + 1;
  const cost = designRoom?.upgradeCosts?.[nextLevel];

  if (!savedRoom || !cost || !canAfford(state.resources, cost)) {
    return null;
  }

  return {
    ...state,
    resources: {
      coins: state.resources.coins - (cost.coins ?? 0),
      comfort: state.resources.comfort - (cost.comfort ?? 0),
    },
    rooms: state.rooms.map((room) => (room.id === roomId ? { ...room, level: nextLevel } : room)),
  };
}
