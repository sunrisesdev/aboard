import Button from '@/components/Button/Button';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import SunrisesWordmark from '../../public/sunrises-wordmark.png';

export const Login = () => {
  return (
    <>
      <Head>
        <title>Anmelden &mdash; aboard.at</title>
      </Head>

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          margin: '2rem auto',
        }}
      >
        <h1 style={{ margin: '0' }}>Welcome aboard!</h1>
        <Button onClick={() => signIn('traewelling')}>
          Anmelden mit Traewelling
        </Button>
        <Image alt="Sunrises Logo" height={32} src={SunrisesWordmark} />
      </div>
    </>
  );
};

export default Login;
