import { User } from '../types';

type LoginInput = {
  login: string;
  password: string;
};

export const login = async (input: LoginInput) => {
  const res = await fetch('https://traewelling.de/api/v1/auth/login', {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = await res.json();

  if (res.status === 200) {
    const {
      data: { expires_at: expiresAt, token },
    } = data;

    return { expiresAt, token };
  }

  throw { message: data, status: res.status };
};

export const logout = async (bearerToken: string) => {
  const res = await fetch('https://traewelling.de/api/v1/auth/logout', {
    headers: {
      Authorization: bearerToken,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (res.status === 200) {
    return true;
  }

  throw { message: await res.json(), status: res.status };
};

export const refresh = async (bearerToken: string) => {
  const res = await fetch('https://traewelling.de/api/v1/auth/refresh', {
    headers: {
      Authorization: bearerToken,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = await res.json();

  if (res.status === 200) {
    const {
      data: { expires_at: expiresAt, token },
    } = data;

    return { expiresAt, token };
  }

  throw { message: await data, status: res.status };
};

export const user = async (bearerToken: string) => {
  const res = await fetch('https://traewelling.de/api/v1/auth/user', {
    headers: {
      Authorization: bearerToken,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as User;
  }

  throw { message: await data, status: res.status };
};
