'use client';

import { useSession } from 'next-auth/react';

const Username = () => {
  const { data: session } = useSession();

  if (!session?.user.name) return null;

  return <span>{session.user.name}</span>;
};

export default Username;
