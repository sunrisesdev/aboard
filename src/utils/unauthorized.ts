import { NextApiResponse } from 'next';

export const unauthorized = (res: NextApiResponse) => {
  res.status(401).send('Unauthorized');
};
