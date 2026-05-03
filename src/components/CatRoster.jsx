import { cats as catData } from '../data/cats.js';
import { useGameState } from '../store/gameState.js';
import { CatPortrait } from './CatPortrait.jsx';

export function CatRoster({ draggingCatId, isDragging, onCatPointerDown, onOpenCatInfo }) {
  const { state } = useGameState();
  const unassignedCats = state.cats.filter((cat) => cat.currentRoom === null);

  return (
    <nav className="cat-roster" aria-label="Cat roster">
      {unassignedCats.length === 0 ? (
        <p className="cat-roster-empty">All cats are placed</p>
      ) : (
        unassignedCats.map((cat) => {
          const designCat = catData.find((entry) => entry.id === cat.id);
          const isActiveDrag = draggingCatId === cat.id;

          return (
            <button
              className={`cat-roster-button ${isActiveDrag ? 'dragging' : ''}`}
              key={cat.id}
              type="button"
              onPointerDown={(event) => onCatPointerDown(cat.id, event)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenCatInfo(cat.id);
                }
              }}
              aria-pressed={isActiveDrag && isDragging}
            >
              <CatPortrait catId={cat.id} />
              <span className="cat-name">{designCat?.name ?? cat.name}</span>
            </button>
          );
        })
      )}
    </nav>
  );
}
