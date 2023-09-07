import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export const getUnread = async () => {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    'https://traewelling.de/api/v1/notifications/unread/count',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.user.accessToken!}`,
      },
      next: {
        revalidate: 60,
      },
    }
  );

  const data = await res.json();

  if (res.status === 200) {
    return data.data as number;
  } else if (res.status === 404) {
    return null;
  }

  throw { message: await data, status: res.status };
};
