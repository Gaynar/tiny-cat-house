import { useState } from 'react';
import { cats } from '../data/cats.js';

const CAT_COLORS = {
  miso: '#d9b98f',
  bean: '#f0c15a',
  mochi: '#d7d4cb',
};

export function CatPortrait({ catId }) {
  const [imageMissing, setImageMissing] = useState(false);
  const cat = cats.find((entry) => entry.id === catId);
  const initial = cat?.name?.charAt(0) ?? '?';

  return (
    <span className="cat-portrait" style={{ '--cat-color': CAT_COLORS[catId] ?? '#d7d4cb' }}>
      {!imageMissing ? (
        <img
          className="pixel-art"
          src={`/assets/cats/portraits/${catId}.png`}
          alt=""
          onError={() => setImageMissing(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
