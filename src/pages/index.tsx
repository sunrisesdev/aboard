import Button from '@/components/Button/Button';
import CheckInDialog from '@/components/CheckInDialog/CheckInDialog';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';
import { AuthGuard } from '../components/AuthGuard/AuthGuard';

const HomePage = () => {
  const { data: session } = useSession();
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <>
      <Head>
        <title>aboard.at</title>
        <meta
          name="description"
          content="Aboard is an alternative webclient for Träwelling focused on mobile UX."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthGuard>
        <main>
          <div>Hallo {session?.user?.name}!</div>
          <Button onClick={() => signOut()}>Abmelden</Button>
          <Button onClick={() => setCheckInOpen(true)}>Check-In</Button>
          <CheckInDialog isOpen={checkInOpen} onIsOpenChange={setCheckInOpen} />
        </main>
      </AuthGuard>
    </>
  );
};

export default HomePage;
