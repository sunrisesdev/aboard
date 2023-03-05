'use client';

import Button from '@/components/Button/Button';
import CheckIn from '@/components/CheckIn/CheckIn';
import CheckInDialog from '@/components/CheckInDialog/CheckInDialog';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

const DashboardHome = () => {
  const { data: session } = useSession();
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <main>
      <div>Hallo {session?.user?.name}!</div>
      <Button onClick={() => signOut()}>Abmelden</Button>
      <Button onClick={() => setCheckInOpen(true)}>Check-In</Button>
      <CheckInDialog isOpen={checkInOpen} onIsOpenChange={setCheckInOpen} />

      <CheckIn />
    </main>
  );
};

export default DashboardHome;
