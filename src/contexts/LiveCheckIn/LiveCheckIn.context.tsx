'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { LiveCheckIn, LiveCheckInContextValue } from './types';

export const LiveCheckInContext = createContext<LiveCheckInContextValue>({
  addCheckIn: () => void 0,
  currentCheckInIndex: 0,
  journey: [],
  nextCheckIn: undefined,
  remainingCheckIns: [],
  untilNextCheckIn: undefined,
});

const LiveCheckInContextProvider = ({ children }: { children: ReactNode }) => {
  const [checkIns, setCheckIns] = useState<LiveCheckIn[]>([]);
  const [_, refresh] = useState(0);

  const remainingCheckIns = checkIns.filter(({ checkedIn }) => !checkedIn);
  const untilNextCheckIn =
    remainingCheckIns.length === 0
      ? undefined
      : new Date(remainingCheckIns.at(0)?.trip.when!).getTime() - Date.now();

  const tryCheckIn = useCallback(() => {
    if (typeof untilNextCheckIn === 'undefined' || untilNextCheckIn > 0) {
      return;
    }

    // TODO: Send request

    const modified = [...checkIns];
    modified.find(({ checkedIn }) => !checkedIn)!.checkedIn = true;
    setCheckIns(modified);
  }, [checkIns, untilNextCheckIn]);

  const contextValue: LiveCheckInContextValue = {
    addCheckIn: (trip, destination) => {
      setCheckIns([...checkIns, { checkedIn: false, destination, trip }]);
    },
    currentCheckInIndex: checkIns.length - remainingCheckIns.length,
    journey: checkIns,
    nextCheckIn: remainingCheckIns.at(0),
    remainingCheckIns: remainingCheckIns,
    untilNextCheckIn,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tryCheckIn();
      refresh((r) => r + 1);
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
      refresh(0);
    };
  }, [tryCheckIn]);

  return (
    <LiveCheckInContext.Provider value={contextValue}>
      {children}
    </LiveCheckInContext.Provider>
  );
};

export default LiveCheckInContextProvider;
