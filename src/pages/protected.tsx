import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { AuthGuard } from '../components/AuthGuard/AuthGuard';

const ProtectedPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>enroute.social</title>
      </Head>

      <AuthGuard>
        <div>Hallo {session?.traewelling.token}!</div>
        <button onClick={() => signOut()}>Abmelden</button>
      </AuthGuard>
    </>
  );
};

export default ProtectedPage;
