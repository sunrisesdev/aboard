import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

// export const getServerSideProps = async () => {
//   const providers = await getProviders();

//   return {
//     props: { providers: providers ?? [] },
//   };
// };

export const Login = () => {
  const { data } = useSession();
  return (
    <>
      <Head>
        <title>Anmelden &mdash; aboard.at</title>
      </Head>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div>
        <button onClick={() => signIn('traewelling')}>
          Anmelden mit Traewelling
        </button>

        <button onClick={() => signOut()}>Abmelden</button>
      </div>
    </>
  );
};

export default Login;
