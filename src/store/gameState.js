import { createContext, createElement, useContext, useEffect, useState } from 'react';
import { loadGame, saveGame } from './persistence.js';

export const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const [state, setState] = useState(() => loadGame());

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

  return createElement(
    GameStateContext.Provider,
    { value: { state, setState } },
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
