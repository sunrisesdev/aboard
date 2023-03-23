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
  const res = await fetch(`https://traewelling.de/api/v1/user/${username}`, {
    method: 'GET',
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
  const res = await fetch(
    `https://traewelling.de/api/v1/user/${username}/statuses`,
    {
      method: 'GET',
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
