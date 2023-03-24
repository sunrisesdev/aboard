import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { PublicUser, Status } from '../types';

export const activeStatus = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    'https://traewelling.de/api/v1/user/statuses/active',
    {
      headers: {
        Authorization: `Bearer ${session?.user.accessToken}`,
      },
      method: 'GET',
      cache: 'no-store',
    }
  );

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};

export const get = async (username: string) => {
  const session = await getServerSession(authOptions);
  const headers = {
    Authorization: `Bearer ${session?.user.accessToken!}`,
  };
  const res = await fetch(`https://traewelling.de/api/v1/user/${username}`, {
    method: 'GET',
    headers: !session ? undefined : headers,
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as PublicUser;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};

export const getStatuses = async (username: string) => {
  const session = await getServerSession(authOptions);
  const headers = {
    Authorization: `Bearer ${session?.user.accessToken!}`,
  };
  const res = await fetch(
    `https://traewelling.de/api/v1/user/${username}/statuses`,
    {
      method: 'GET',
      headers: !session ? undefined : headers,
    }
  );

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status[];
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};
