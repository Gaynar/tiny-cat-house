import { Home, Moon, RotateCcw, Sun } from 'lucide-react';
import { GameStateProvider, useGameState } from './store/gameState.js';
import { resetSave } from './store/persistence.js';
import './hector.css';

function formatResource(value) {
  return Math.floor(value ?? 0).toLocaleString();
}

function ResourceBar() {
  const { state } = useGameState();

  return (
    <header className="resource-bar">
      <div>
        <p className="eyebrow">Day {state.day}</p>
        <h1 className="resource-title">Hector&apos;s Adventure</h1>
      </div>
      <div className="resource-pills" aria-label="Resources">
        <div className="resource-pill fishbones" aria-label="Fishbones">
          <span aria-hidden="true">Fishbones</span>
          <strong>{formatResource(state.resources.fishbones)}</strong>
        </div>
        <div className="resource-pill tuna" aria-label="Canned Tuna">
          <span aria-hidden="true">Canned Tuna</span>
          <strong>{formatResource(state.resources.cannedTuna)}</strong>
        </div>
      </div>
    </header>
  );
}

function PhaseBadge() {
  const { state } = useGameState();
  const isDay = state.phase === 'day';
  const Icon = isDay ? Sun : Moon;

  return (
    <div className={`phase-badge ${isDay ? 'day' : 'night'}`}>
      <Icon aria-hidden="true" />
      <span>{isDay ? 'Day preparation' : 'Night run'}</span>
    </div>
  );
}

function HectorPanel() {
  const { state } = useGameState();
  const stats = state.hector.stats;

  return (
    <section className="panel hector-panel" aria-labelledby="hector-heading">
      <div className="hector-portrait pixel-art" aria-hidden="true">
        H
      </div>
      <div>
        <p className="eyebrow">Main character</p>
        <h2 id="hector-heading">Hector</h2>
        <p>{state.hector.summary}</p>
        <dl className="stat-grid">
          <div>
            <dt>HP</dt>
            <dd>{stats.maxHp}</dd>
          </div>
          <div>
            <dt>MP</dt>
            <dd>{stats.maxMp}</dd>
          </div>
          <div>
            <dt>Attack</dt>
            <dd>{stats.attack}</dd>
          </div>
          <div>
            <dt>Defense</dt>
            <dd>{stats.defense}</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>{stats.speed}</dd>
          </div>
          <div>
            <dt>Luck</dt>
            <dd>{stats.luck}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function HousePanel() {
  const { state } = useGameState();

  return (
    <section className="panel house-panel" aria-labelledby="house-heading">
      <div className="section-heading">
        <Home aria-hidden="true" />
        <div>
          <p className="eyebrow">Terraced house</p>
          <h2 id="house-heading">Day Rooms</h2>
        </div>
      </div>
      <div className="room-grid">
        {state.house.rooms.map((room) => (
          <article className="room-card" key={room.id}>
            <p className="room-floor">Floor {room.floor}</p>
            <h3>{room.name}</h3>
            <p>{room.activity}</p>
            <small>Tier {room.upgradeTier}: {room.effect}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function PhaseControls() {
  const { state, setState } = useGameState();
  const isDay = state.phase === 'day';

  function startNight() {
    setState((currentState) => ({
      ...currentState,
      phase: 'night',
      currentRun: {
        level: 1,
        xp: 0,
        hp: currentState.hector.stats.maxHp,
        mp: currentState.hector.stats.maxMp,
        abilities: [],
        items: [],
        map: [],
        currentNodeId: null,
        completedNodeIds: [],
        status: 'exploring',
      },
    }));
  }

  function returnHome() {
    setState((currentState) => ({
      ...currentState,
      day: currentState.day + 1,
      phase: 'day',
      currentRun: null,
    }));
  }

  return (
    <section className="panel control-panel" aria-labelledby="phase-heading">
      <PhaseBadge />
      <h2 id="phase-heading">{isDay ? 'Prepare for tonight' : 'Back Alley run started'}</h2>
      <p>
        {isDay
          ? 'The full day timer and room preparation loop comes next. For now, the clean Hector save and phase flow are active.'
          : 'The generated map and combat engine come next. Returning home clears this placeholder run.'}
      </p>
      {isDay ? (
        <button className="primary-button" type="button" onClick={startNight}>
          Start Night
        </button>
      ) : (
        <button className="primary-button" type="button" onClick={returnHome}>
          Return Home
        </button>
      )}
    </section>
  );
}

function DebugPanel() {
  function handleReset() {
    resetSave();
    window.location.reload();
  }

  return (
    <div className="debug-row">
      <button className="debug-reset" type="button" onClick={handleReset}>
        <RotateCcw aria-hidden="true" />
        Reset save
      </button>
    </div>
  );
}

function Game() {
  return (
    <div className="app-shell">
      <ResourceBar />
      <main className="app-main">
        <PhaseControls />
        <div className="dashboard-grid">
          <HectorPanel />
          <HousePanel />
        </div>
        <DebugPanel />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <Game />
    </GameStateProvider>
  );
}
