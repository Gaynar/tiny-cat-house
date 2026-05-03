import { useEffect } from 'react';
import { X } from 'lucide-react';

const AUTO_DISMISS_MS = 8000;

function EventCard({ event, onDismiss }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => onDismiss(event.localId), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [event.localId, onDismiss]);

  return (
    <article className="event-card" onClick={() => onDismiss(event.localId)}>
      <button type="button" onClick={() => onDismiss(event.localId)} aria-label="Dismiss event">
        <X aria-hidden="true" />
      </button>
      <h3>{event.title}</h3>
      <p>{event.flavor}</p>
    </article>
  );
}

export function EventCardStack({ events, onDismiss }) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="event-card-stack" aria-live="polite">
      {events.map((event) => (
        <EventCard key={event.localId} event={event} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
