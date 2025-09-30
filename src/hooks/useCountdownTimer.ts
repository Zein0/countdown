// Hook that provides a ticking string representation for the event detail screen.
import { useEffect, useState } from 'react';
import { EventMode } from '../types';
import { describeTimeDelta, getCountdownText } from '../utils/time';

export const useCountdownTimer = (date: string, mode: EventMode) => {
  const [primaryText, setPrimaryText] = useState(() => getCountdownText(date, mode));
  const [secondaryText, setSecondaryText] = useState(() => describeTimeDelta(date, mode));

  useEffect(() => {
    setPrimaryText(getCountdownText(date, mode));
    setSecondaryText(describeTimeDelta(date, mode));
    const interval = setInterval(() => {
      setPrimaryText(getCountdownText(date, mode));
      setSecondaryText(describeTimeDelta(date, mode));
    }, 1000);
    return () => clearInterval(interval);
  }, [date, mode]);

  return { primaryText, secondaryText };
};
