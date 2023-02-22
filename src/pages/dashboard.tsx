import StationSearch from '@/components/StationSearch/StationSearch';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { AuthGuard } from '../components/AuthGuard/AuthGuard';

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>enroute.social</title>
      </Head>

      <AuthGuard>
        <div>Hallo {session?.user?.name}!</div>
        <button onClick={() => signOut()}>Abmelden</button>

        <StationSearch />
      </AuthGuard>
    </>
  );
};

export default DashboardPage;
