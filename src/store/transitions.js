import { TRANSITIONS } from '../data/states.js';

const MINUTE_MS = 60_000;

function transitionFrom(fromState) {
  return TRANSITIONS.find((transition) => transition.from === fromState && transition.trigger === 'time');
}

function durationForTransition(transition, cat) {
  if (!transition?.durationMinutes) {
    return null;
  }

  const [min, max] = transition.durationMinutes;
  const sampled = min === max ? min : min + Math.random() * (max - min);

  if (transition.from === 'resting' && transition.to === 'sleeping' && cat.traits?.includes('lazy')) {
    return sampled * 0.6;
  }

  if (transition.from === 'grumpy' && cat.traits?.includes('calm')) {
    return sampled * 0.5;
  }

  return sampled;
}

export function sampleTransitionDue(fromState, cat, nowMs = Date.now()) {
  const transition = transitionFrom(fromState);
  const durationMinutes = durationForTransition(transition, cat);

  return durationMinutes === null ? null : nowMs + durationMinutes * MINUTE_MS;
}

export function setCatState(cat, newState, nowMs = Date.now()) {
  return {
    ...cat,
    currentState: newState,
    stateEnteredAt: nowMs,
    stateTransitionDue: cat.currentRoom ? sampleTransitionDue(newState, cat, nowMs) : null,
  };
}

export function processStateTransitions(state, nowMs = Date.now()) {
  let changed = false;

  const cats = state.cats.map((cat) => {
    if (!cat.currentRoom || !cat.stateTransitionDue || nowMs < cat.stateTransitionDue) {
      return cat;
    }

    const transition = transitionFrom(cat.currentState);
    if (!transition) {
      return { ...cat, stateTransitionDue: null };
    }

    changed = true;
    return setCatState(cat, transition.to, nowMs);
  });

  return changed ? { ...state, cats } : state;
}
