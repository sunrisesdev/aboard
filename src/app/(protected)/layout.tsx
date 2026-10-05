import type { PropsWithChildren } from 'react';
import { requireSession } from '@/lib/auth';
import { UserContextProvider } from '@/user/User.context';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const { user } = await requireSession();

  return <UserContextProvider user={user}>{children}</UserContextProvider>;
}
