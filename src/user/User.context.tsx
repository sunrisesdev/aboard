'use client';

import { createContext, type PropsWithChildren } from 'react';
import type { TraewellingUser } from '@/lib/traewelling';

export const UserContext = createContext<TraewellingUser | null>(null);

// Holds the user as stored in the session, so changes made on Träwelling only show up after the next sign-in.
export const UserContextProvider = ({ children, user }: PropsWithChildren<{ user: TraewellingUser }>) => {
  return <UserContext value={user}>{children}</UserContext>;
};
