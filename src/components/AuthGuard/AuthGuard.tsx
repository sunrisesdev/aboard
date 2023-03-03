'use client';

import Login from '@/components/Login/Login';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();

  if (status !== 'loading') {
    if (status === 'unauthenticated') {
      return <Login />;
    }

    return <>{children}</>;
  }

  return <div>Loading</div>;
};
