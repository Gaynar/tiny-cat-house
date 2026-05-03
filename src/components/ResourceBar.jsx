import { Coins, Heart } from 'lucide-react';
import { useGameState } from '../store/gameState.js';

export function ResourceBar() {
  const { state } = useGameState();

  return (
    <header className="resource-bar">
      <h1 className="resource-title">Kitty Tower Idle</h1>
      <div className="resource-pills" aria-label="Resources">
        <div className="resource-pill coins" aria-label="Coins">
          <Coins aria-hidden="true" />
          <span>{Math.floor(state.resources.coins)}</span>
        </div>
        <div className="resource-pill comfort" aria-label="Comfort" data-tutorial-target="comfort-pill">
          <Heart aria-hidden="true" />
          <span>{Math.floor(state.resources.comfort)}</span>
        </div>
      </div>
    </header>
  );
}
