import { Status } from '../types';

type SingleInput = {
  id: string;
};

export const single = async (input: SingleInput, bearerToken?: string) => {
  const headers = {
    Authorization: bearerToken!,
  };

  const res = await fetch(`https://traewelling.de/api/v1/status/${input.id}`, {
    headers: !bearerToken ? undefined : headers,
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Status;
  } else if ([403, 404].includes(res.status)) {
    return null;
  }

  throw { message: await data, status: res.status };
};
