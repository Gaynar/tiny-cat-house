import { useState } from 'react';

export function FurnitureSlot({ item, disabled, onBuy }) {
  const [imageMissing, setImageMissing] = useState(false);

  if (!item) {
    return <div className="furniture-slot empty">Empty slot</div>;
  }

  return (
    <button className="furniture-slot" type="button" disabled={disabled} onClick={onBuy}>
      {!imageMissing ? (
        <img
          className="pixel-art"
          src={`/assets/furniture/${item.id}.png`}
          alt=""
          onError={() => setImageMissing(true)}
        />
      ) : null}
      <span>{item.name}</span>
      {onBuy ? (
        <small>
          {item.cost.coins} coins
          {item.cost.comfort ? ` / ${item.cost.comfort} comfort` : ''}
        </small>
      ) : null}
    </button>
  );
}
