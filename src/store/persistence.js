import { createInitialState } from './initialState.js';

export const SAVE_KEY = 'kittyTowerIdle_save';

function mergeById(defaultItems, savedItems) {
  if (!Array.isArray(savedItems)) {
    return defaultItems;
  }

  return defaultItems.map((defaultItem) => {
    const savedItem = savedItems.find((item) => item?.id === defaultItem.id);
    return savedItem ? deepMerge(defaultItem, savedItem) : defaultItem;
  });
}

function deepMerge(defaultValue, savedValue) {
  if (Array.isArray(defaultValue)) {
    if (
      defaultValue.length > 0 &&
      defaultValue.every((item) => item && typeof item === 'object' && 'id' in item)
    ) {
      return mergeById(defaultValue, savedValue);
    }

    return Array.isArray(savedValue) ? savedValue : defaultValue;
  }

  if (
    defaultValue &&
    typeof defaultValue === 'object' &&
    savedValue &&
    typeof savedValue === 'object' &&
    !Array.isArray(savedValue)
  ) {
    const keys = new Set([...Object.keys(defaultValue), ...Object.keys(savedValue)]);
    return Object.fromEntries(
      [...keys].map((key) => [key, deepMerge(defaultValue[key], savedValue[key])]),
    );
  }

  return savedValue ?? defaultValue;
}

export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame() {
  const freshState = createInitialState();
  const rawSave = localStorage.getItem(SAVE_KEY);

  if (!rawSave) {
    return freshState;
  }

  try {
    const savedState = JSON.parse(rawSave);
    return deepMerge(freshState, savedState);
  } catch {
    return freshState;
  }
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
}
