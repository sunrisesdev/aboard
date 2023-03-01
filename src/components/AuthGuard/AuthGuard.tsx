import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import LoginPage from '../../pages/login';

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();

  if (status !== 'loading') {
    if (status === 'unauthenticated') {
      return <LoginPage />;
    }

    return <>{children}</>;
  }

  return <div>Loading</div>;
};
