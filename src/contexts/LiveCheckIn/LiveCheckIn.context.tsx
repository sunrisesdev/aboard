'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
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

  const contextValue: LiveCheckInContextValue = {
    addCheckIn: (trip, destination) => {
      setCheckIns([...checkIns, { checkedIn: false, destination, trip }]);
    },
    currentCheckInIndex: checkIns.length - remainingCheckIns.length,
    journey: checkIns,
    nextCheckIn: remainingCheckIns.at(0),
    remainingCheckIns: remainingCheckIns,
    untilNextCheckIn:
      new Date(remainingCheckIns.at(0)?.trip.when!).getTime() - Date.now(),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refresh((r) => r + 1);
    }, 1000 * 30);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <LiveCheckInContext.Provider value={contextValue}>
      {children}
    </LiveCheckInContext.Provider>
  );
};

export default LiveCheckInContextProvider;
