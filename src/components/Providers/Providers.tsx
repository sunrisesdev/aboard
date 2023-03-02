'use client';

import { SessionProvider } from 'next-auth/react';
import type { ProvidersProps } from './types';

const Providers = ({ children, session }: ProvidersProps) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Providers;
