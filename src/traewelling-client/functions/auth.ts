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
