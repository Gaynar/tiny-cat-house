import { useState } from 'react';
import { cats } from '../data/cats.js';

const CAT_COLORS = {
  miso: '#d9b98f',
  bean: '#f0c15a',
  mochi: '#d7d4cb',
};

export function CatFullArt({ catId }) {
  const [imageMissing, setImageMissing] = useState(false);
  const cat = cats.find((entry) => entry.id === catId);
  const initial = cat?.name?.charAt(0) ?? '?';

  return (
    <div className="cat-full-art" style={{ '--cat-color': CAT_COLORS[catId] ?? '#d7d4cb' }}>
      {!imageMissing ? (
        <img
          className="pixel-art"
          src={`/assets/cats/full-art/${catId}.png`}
          alt=""
          onError={() => setImageMissing(true)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </div>
  );
}
