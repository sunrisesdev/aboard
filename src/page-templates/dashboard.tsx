'use client';

import Button from '@/components/Button/Button';
import CheckIn from '@/components/CheckIn/CheckIn';
import { signOut, useSession } from 'next-auth/react';

const DashboardHome = () => {
  const { data: session } = useSession();

  return (
    <main>
      <div>Hallo {session?.user?.name}!</div>
      <Button onClick={() => signOut()}>Abmelden</Button>

      <CheckIn />
    </main>
  );
};

export default DashboardHome;
