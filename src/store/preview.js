import { findCat, findRoom, isDislikeActive, isLikeActive } from './production.js';

export function previewPlacement(cat, room, currentCatsInRoom) {
  const designCat = findCat(cat.id) ?? cat;
  const designRoom = findRoom(room.id) ?? room;
  const projectedCats = [...currentCatsInRoom.filter((entry) => entry.id !== cat.id), designCat];

  if (isDislikeActive(designCat, designRoom, projectedCats)) {
    return 'dislike';
  }

  if (isLikeActive(designCat, designRoom, projectedCats)) {
    return 'like';
  }

  return 'neutral';
}
