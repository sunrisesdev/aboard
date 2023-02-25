import CheckInDialog from '@/components/CheckInDialog/CheckInDialog';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import { AuthGuard } from '../components/AuthGuard/AuthGuard';

const DashboardPage = () => {
  const { data: session } = useSession();
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <>
      <Head>
        <title>aboard.at</title>
      </Head>

      <AuthGuard>
        <div>Hallo {session?.user?.name}!</div>
        <button onClick={() => signOut()}>Abmelden</button>

        <button onClick={() => setCheckInOpen(true)}>Check-In</button>

        <CheckInDialog isOpen={checkInOpen} onIsOpenChange={setCheckInOpen} />
      </AuthGuard>
    </>
  );
};

export default DashboardPage;
