'use client';

import { use } from 'react';
import { CurrentStatusesContext } from './CurrentStatuses.context';

// Returns the promise instead of its value, so components that only need `refresh` don't suspend
export const useCurrentStatuses = () => {
  const context = use(CurrentStatusesContext);

  if (!context) {
    throw new Error('useCurrentStatuses must be used within a CurrentStatusesProvider');
  }

  return context;
};
