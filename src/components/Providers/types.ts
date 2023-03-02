import { Session } from 'next-auth';
import { ReactNode } from 'react';

export type ProvidersProps = {
  children: ReactNode;
  session: Session | null | undefined;
};
