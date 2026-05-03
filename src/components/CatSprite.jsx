import { useState } from 'react';
import { cats } from '../data/cats.js';

const CAT_COLORS = {
  miso: '#d9b98f',
  bean: '#f0c15a',
  mochi: '#d7d4cb',
};

export function CatSprite({ catId, state = 'active', frame = 0 }) {
  const [imageMissing, setImageMissing] = useState(false);
  const cat = cats.find((entry) => entry.id === catId);
  const initial = cat?.name?.charAt(0) ?? '?';

  return (
    <span
      className="cat-sprite"
      style={{ '--cat-color': CAT_COLORS[catId] ?? '#d7d4cb' }}
      aria-label={`${cat?.name ?? catId} is ${state}, frame ${frame}`}
    >
      {!imageMissing ? (
        <img
          className="pixel-art"
          src={`/assets/cats/sprites/${catId}.png`}
          alt=""
          onError={() => setImageMissing(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
