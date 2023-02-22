import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { useState } from 'react';

// export const getServerSideProps = async () => {
//   const providers = await getProviders();

//   return {
//     props: { providers: providers ?? [] },
//   };
// };

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Head>
        <title>Anmelden &mdash; enroute.social</title>
      </Head>

      <div>
        <input
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Benutzername"
          value={username}
        />

        <input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          type="password"
          value={password}
        />

        <button
          onClick={() => signIn('traewelling', { login: username, password })}
        >
          Anmelden mit Traewelling
        </button>
      </div>
    </>
  );
};

export default Login;
