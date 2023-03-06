import { Status } from '../types';

export const activeStatus = async (bearerToken: string) => {
  const res = await fetch(
    'https://traewelling.de/api/v1/user/statuses/active',
    {
      headers: {
        Authorization: bearerToken,
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
