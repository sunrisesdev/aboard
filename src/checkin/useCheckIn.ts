'use client';

import { use } from 'react';
import { CheckInContext } from './CheckIn.context';

export const useCheckIn = () => {
  const context = use(CheckInContext);

  if (!context) {
    throw new Error('useCheckIn must be used within a CheckInContextProvider');
  }

  return context;
};
