import Login from '@/components/Login/Login';
import Head from 'next/head';

export const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Anmelden &mdash; aboard.at</title>
      </Head>

      <Login />
    </>
  );
};

export default LoginPage;
