import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { Status } from '../types';

type SingleInput = {
  id: string;
};

export const single = async (input: SingleInput) => {
  const session = await getServerSession(authOptions);

  const headers = {
    Authorization: `Bearer ${session?.user.accessToken!}`,
  };

  const res = await fetch(`https://traewelling.de/api/v1/status/${input.id}`, {
    headers: !session ? undefined : headers,
    method: 'GET',
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if ([403, 404].includes(res.status)) {
    return null;
  }

  throw { message: await data, status: res.status };
};

type LikeInput = {
  id: string;
  method: 'POST' | 'DELETE';
};

export const like = async (input: LikeInput) => {
  const session = await getServerSession(authOptions);

  const headers = {
    Authorization: `Bearer ${session?.user.accessToken!}`,
  };

  const res = await fetch(
    `https://traewelling.de/api/v1/status/${input.id}/like`,
    {
      headers: !session ? undefined : headers,
      method: input.method,
    }
  );

  const data = await res.json();

  if (res.ok) {
    return data.data as Status;
  } else if ([403, 404].includes(res.status)) {
    return null;
  }

  throw { message: await data, status: res.status };
};

export const dashboard = async () => {
  const session = await getServerSession(authOptions);

  const headers = {
    Authorization: `Bearer ${session?.user.accessToken!}`,
  };

  const res = await fetch('https://traewelling.de/api/v1/statuses', {
    headers: !session ? undefined : headers,
    method: 'GET',
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status[];
  }
};

export const remove = async (input: SingleInput) => {
  const session = await getServerSession(authOptions);

  const res = await fetch(`https://traewelling.de/api/v1/status/${input.id}`, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken!}`,
    },
    method: 'DELETE',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if ([403, 404].includes(res.status)) {
    return null;
  }

  throw { message: await data, status: res.status };
};
