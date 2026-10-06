import type { PropsWithChildren } from 'react';
import { Navbar } from '@/components/Navbar/Navbar';
import { requireSession } from '@/lib/auth';
import { UserContextProvider } from '@/user/User.context';

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const { user } = await requireSession();

  return (
    <UserContextProvider user={user}>
      <Navbar />

      {children}
    </UserContextProvider>
  );
}
