import { X } from 'lucide-react';
import { cats as catData } from '../data/cats.js';
import { furniture } from '../data/furniture.js';
import { rooms } from '../data/rooms.js';
import { useGameState } from '../store/gameState.js';
import { calculateCatOutput } from '../store/production.js';
import { CatFullArt } from './CatFullArt.jsx';
import { CatPortrait } from './CatPortrait.jsx';

function formatLabel(value) {
  return value.replaceAll('_', ' ');
}

export function CatInfoPanel({ catId, onClose }) {
  const { state } = useGameState();
  const savedCat = state.cats.find((cat) => cat.id === catId);
  const designCat = catData.find((cat) => cat.id === catId);
  const currentRoom = rooms.find((room) => room.id === savedCat?.currentRoom);
  const catsInRoom = state.cats.filter((cat) => cat.currentRoom === savedCat?.currentRoom);
  const favoriteFurniture = furniture.find((item) => item.id === designCat?.favoriteFurniture);
  const output =
    savedCat && currentRoom ? calculateCatOutput(savedCat, currentRoom, catsInRoom, state.cats, state.rooms) : null;

  if (!savedCat || !designCat) {
    return null;
  }

  return (
    <div className="cat-info-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="cat-info-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-info-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="cat-info-close" type="button" onClick={onClose} aria-label="Close cat info">
          <X aria-hidden="true" />
        </button>
        <CatFullArt catId={catId} />
        <header className="cat-info-header">
          <CatPortrait catId={catId} />
          <div>
            <h2 id="cat-info-title">{designCat.name}</h2>
            <p>{designCat.role}</p>
          </div>
        </header>
        <p className="cat-info-flavor">{designCat.flavorText}</p>
        <dl className="cat-info-stats">
          <div>
            <dt>Traits</dt>
            <dd>{designCat.traits.map(formatLabel).join(', ')}</dd>
          </div>
          <div>
            <dt>Likes</dt>
            <dd>{formatLabel(designCat.like)}</dd>
          </div>
          <div>
            <dt>Dislikes</dt>
            <dd>{formatLabel(designCat.dislike)}</dd>
          </div>
          <div>
            <dt>Favorite</dt>
            <dd>{favoriteFurniture?.name ?? formatLabel(designCat.favoriteFurniture)}</dd>
          </div>
          <div>
            <dt>Room</dt>
            <dd>{currentRoom?.name ?? 'Roster'}</dd>
          </div>
          <div>
            <dt>Output</dt>
            <dd>{output ? `${output.coins.toFixed(1)} coin/min, ${output.comfort.toFixed(1)} comfort/min` : 'Idle'}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
