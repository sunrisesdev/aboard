'use client';

import { use } from 'react';
import { StationboardContext } from './Stationboard.context';

export function useStationboard() {
  const context = use(StationboardContext);

  if (!context) {
    throw new Error('useStationboard must be used within a StationboardContextProvider');
  }

  return context;
}
