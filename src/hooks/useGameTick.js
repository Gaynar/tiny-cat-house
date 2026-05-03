import { useEffect } from 'react';
import { runTick } from '../store/tick.js';

export function useGameTick(setState) {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setState((state) => runTick(state, Date.now()));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [setState]);
}
