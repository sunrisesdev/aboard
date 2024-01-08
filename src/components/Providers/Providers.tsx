'use client';

import { CheckInProvider } from '@/contexts/CheckIn/CheckIn.context';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import type { ProvidersProps } from './types';

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <CheckInProvider>{children}</CheckInProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </SessionProvider>
  );
};

export default Providers;
