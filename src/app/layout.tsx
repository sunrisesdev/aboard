import Layout from '@/components/Layout/Layout';
import Providers from '@/components/Providers/Providers';
import UmamiScript from '@/scripts/UmamiScript/UmamiScript';
import { sourceSans3 } from '@/styles/fonts';
import '@/styles/globals.css';
import type { Metadata } from 'next';
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
          <Layout>{children}</Layout>
        </Providers>
        <UmamiScript />
      </body>
    </html>
  );
}

const APP_NAME = 'Aboard';
const APP_DEFAULT_TITLE = 'aboard.at';
const APP_TITLE_TEMPLATE = '%s - Aboard.at';
const APP_DESCRIPTION =
  'Aboard is an alternative webclient for Träwelling focused on mobile UX.';

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};
