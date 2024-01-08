'use client';

import { useSession } from 'next-auth/react';
import { Suspense } from 'react';
import Shimmer from '../Shimmer/Shimmer';

const UsernameBase = () => {
  const { data: session } = useSession();

  if (!session?.user.name) return null;

  return <span>{session.user.name}</span>;
};

const Username = () => {
  return (
    <Suspense fallback={<Shimmer height="1.25rem" width="5rem" />}>
      <UsernameBase />
    </Suspense>
  );
};

export default Username;
