import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react';
import { useGameTick } from '../hooks/useGameTick.js';
import { simulateOffline } from './offline.js';
import { loadGame, saveGame } from './persistence.js';
import { runTick } from './tick.js';

export const GameStateContext = createContext(null);

let liveEventCounter = 0;

function withLocalId(event) {
  liveEventCounter += 1;
  return { ...event, localId: `${event.id}-${event.at ?? Date.now()}-${liveEventCounter}` };
}

export function GameStateProvider({ children }) {
  const [initialLoad] = useState(() => {
    const loadedState = loadGame();
    return simulateOffline(loadedState, Date.now());
  });
  const [offlineSummary, setOfflineSummary] = useState(initialLoad.summary);
  const [state, setState] = useState(initialLoad.newState);
  const [liveEvents, setLiveEvents] = useState([]);

  const onTick = useCallback((nowMs) => {
    setState((currentState) => {
      const result = runTick(currentState, nowMs);
      if (result.firedEvents.length > 0) {
        setLiveEvents((prev) => [...prev, ...result.firedEvents.map(withLocalId)]);
      }
      return result.state;
    });
  }, []);

  useGameTick(onTick);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        saveGame(currentState);
        return currentState;
      });
    }, 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        saveGame(state);
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state]);

  const dismissLiveEvent = useCallback((localId) => {
    setLiveEvents((prev) => prev.filter((event) => event.localId !== localId));
  }, []);

  function collectOfflineSummary() {
    setState((currentState) => ({ ...currentState, offlineEventQueue: [] }));
    setOfflineSummary(null);
  }

  return createElement(
    GameStateContext.Provider,
    { value: { state, setState, offlineSummary, collectOfflineSummary, liveEvents, dismissLiveEvent } },
    children,
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);

  if (!context) {
    throw new Error('useGameState must be used inside GameStateProvider');
  }

  return context;
}
