'use client';

import { use } from 'react';
import { UserContext } from './User.context';

export function useUser() {
  const context = use(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }

  return context;
}
