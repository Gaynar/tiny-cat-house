import { X } from 'lucide-react';
import { useGameState } from '../store/gameState.js';

const STEPS = [
  'Drag Miso into the Bedroom.',
  'Miso is ready for a cozy nap.',
  'Watch Comfort start ticking upward.',
  'Open the Bedroom room panel.',
  'Try the upgrade button when you can afford it.',
];

export function Tutorial() {
  const { state, setState } = useGameState();
  const step = state.tutorialStep ?? 0;

  if (step >= 5) {
    return null;
  }

  function skip() {
    setState((currentState) => ({
      ...currentState,
      tutorialStep: 5,
      pendingPostTutorialEvent: !currentState.postTutorialEventFired,
    }));
  }

  return (
    <aside className="tutorial-card" aria-live="polite">
      <button type="button" onClick={skip} aria-label="Skip tutorial">
        <X aria-hidden="true" />
      </button>
      <strong>Step {step + 1}</strong>
      <p>{STEPS[step]}</p>
    </aside>
  );
}
