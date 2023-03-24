import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { User } from '../types';

export const user = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch('https://traewelling.de/api/v1/auth/user', {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
    next: {
      revalidate: 5 * 60 * 1000,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as User;
  }

  throw { message: await data, status: res.status };
};
