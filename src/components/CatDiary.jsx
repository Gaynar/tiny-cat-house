import { useState } from 'react';
import { BookOpen, Lock, X } from 'lucide-react';
import { DIARY_CATALOG } from '../store/diary.js';
import { useGameState } from '../store/gameState.js';

const TABS = ['cats', 'interactions', 'events', 'hints'];

function discoveredSet(entries) {
  return new Set(entries.map((entry) => entry.id));
}

export function CatDiary({ onClose }) {
  const { state } = useGameState();
  const [tab, setTab] = useState('cats');
  const discovered = {
    interactions: discoveredSet(state.diary.interactions),
    events: discoveredSet(state.diary.events),
    hints: discoveredSet(state.diary.hints),
  };

  const entries =
    tab === 'cats'
      ? state.cats.map((cat) => ({ id: cat.id, title: cat.name, hint: 'Known tower resident' }))
      : DIARY_CATALOG[tab];

  return (
    <div className="panel-backdrop" role="presentation" onClick={onClose}>
      <aside className="diary-panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="panel-close" type="button" onClick={onClose} aria-label="Close diary">
          <X aria-hidden="true" />
        </button>
        <header className="diary-header">
          <BookOpen aria-hidden="true" />
          <h2>Cat Diary</h2>
        </header>
        <div className="diary-tabs" role="tablist">
          {TABS.map((entry) => (
            <button className={tab === entry ? 'active' : ''} type="button" key={entry} onClick={() => setTab(entry)}>
              {entry}
            </button>
          ))}
        </div>
        {tab !== 'cats' && discovered[tab].size > 0 ? (
          <p className="diary-counter">
            {discovered[tab].size} of {entries.length} discovered
          </p>
        ) : null}
        <div className="diary-list">
          {entries.map((entry) => {
            const isDiscovered = tab === 'cats' || discovered[tab].has(entry.id);
            return (
              <article className={`diary-entry ${isDiscovered ? '' : 'locked'}`} key={entry.id}>
                {!isDiscovered ? <Lock aria-hidden="true" /> : null}
                <h3>{isDiscovered ? entry.title : 'Undiscovered'}</h3>
                <p>{isDiscovered ? entry.hint : entry.hint}</p>
              </article>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
