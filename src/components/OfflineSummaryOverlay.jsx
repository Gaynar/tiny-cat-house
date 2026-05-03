import { Coins, Heart } from 'lucide-react';
import { useGameState } from '../store/gameState.js';

function formatTime(ms) {
  const minutes = Math.round(ms / 60_000);
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours > 0 ? `${hours}h ${remainder}m` : `${minutes}m`;
}

export function OfflineSummaryOverlay() {
  const { offlineSummary, collectOfflineSummary } = useGameState();

  if (!offlineSummary) {
    return null;
  }

  return (
    <div className="offline-summary" role="dialog" aria-modal="true">
      <section>
        <h2>While you were away</h2>
        <p>{formatTime(offlineSummary.simulatedMs)} simulated</p>
        <div className="offline-gains">
          <span><Coins aria-hidden="true" /> {offlineSummary.coinsEarned.toFixed(1)}</span>
          <span><Heart aria-hidden="true" /> {offlineSummary.comfortEarned.toFixed(1)}</span>
        </div>
        {offlineSummary.events.length > 0 ? (
          <div className="offline-events">
            {offlineSummary.events.map((event) => (
              <article key={`${event.id}-${event.at}`}>
                <strong>{event.title}</strong>
                <p>{event.flavor}</p>
              </article>
            ))}
          </div>
        ) : null}
        {offlineSummary.newDiaryEntries.length > 0 ? (
          <p className="offline-meta">{offlineSummary.newDiaryEntries.length} new diary entries</p>
        ) : null}
        {offlineSummary.relationshipChanges.length > 0 ? (
          <ul className="offline-meta">
            {offlineSummary.relationshipChanges.map((change) => (
              <li key={`${change.catA}-${change.catB}`}>
                {change.catA} ↔ {change.catB}: {change.fromTier} → {change.toTier}
              </li>
            ))}
          </ul>
        ) : null}
        <button type="button" onClick={collectOfflineSummary}>Collect</button>
      </section>
    </div>
  );
}
