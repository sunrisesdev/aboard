import Providers from '@/components/Providers/Providers';
import LiveCheckInContextProvider from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import UmamiScript from '@/scripts/UmamiScript/UmamiScript';
import { sourceSans3 } from '@/styles/fonts';
import '@/styles/globals.css';
import { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import 'normalize.css';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession<any, Session>(authOptions);

  return (
    <html lang="de">
      <head />
      <body className={sourceSans3.className}>
        <Providers session={session}>
          <LiveCheckInContextProvider>{children}</LiveCheckInContextProvider>
        </Providers>
        <UmamiScript />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'aboard.at',
  description:
    'Aboard is an alternative webclient for Träwelling focused on mobile UX.',
  viewport: 'width=device-width, initial-scale=1',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Aboard',
  },
};
