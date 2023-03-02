import { AuthGuard } from '@/components/AuthGuard/AuthGuard';
import '@/styles/globals.css';
import 'normalize.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}

export const metadata = {
  title: 'Dashboard - aboard.at',
};
