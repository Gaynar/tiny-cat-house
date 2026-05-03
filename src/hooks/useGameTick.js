import { useEffect } from 'react';

export function useGameTick(onTick) {
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      onTick(Date.now());
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [onTick]);
}
