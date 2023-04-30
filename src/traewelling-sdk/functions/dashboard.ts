import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { PublicUser, Status } from '../types';

export const personal = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch('https://traewelling.de/api/v1/dashboard', {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
    cache: 'no-store',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};

export const global = async () => {
  const res = await fetch('https://traewelling.de/api/v1/dashboard/global', {
    method: 'GET',
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as PublicUser;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};

export const personalFuture = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch('https://traewelling.de/api/v1/dashboard/future', {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
    cache: 'no-store',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};
