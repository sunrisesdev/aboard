'use client';

import { CheckInProvider } from '@/contexts/CheckIn/CheckIn.context';
import { SessionProvider } from 'next-auth/react';
import type { ProvidersProps } from './types';

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <CheckInProvider>{children}</CheckInProvider>
    </SessionProvider>
  );
};

export default Providers;
