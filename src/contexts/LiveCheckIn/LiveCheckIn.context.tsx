'use client';

import { createContext, ReactNode, useState } from 'react';
import { LiveCheckIn, LiveCheckInContextValue } from './types';

export const LiveCheckInContext = createContext<LiveCheckInContextValue>({
  addCheckIn: () => void 0,
  journey: [],
});

const LiveCheckInContextProvider = ({ children }: { children: ReactNode }) => {
  const [checkIns, setCheckIns] = useState<LiveCheckIn[]>([]);

  const contextValue: LiveCheckInContextValue = {
    addCheckIn: (trip, destination) => {
      setCheckIns([...checkIns, { destination, trip }]);
    },
    journey: checkIns,
  };

  return (
    <LiveCheckInContext.Provider value={contextValue}>
      {children}
    </LiveCheckInContext.Provider>
  );
};

export default LiveCheckInContextProvider;
