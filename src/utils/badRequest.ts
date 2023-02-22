import { NextApiResponse } from 'next';

export const badRequest = (res: NextApiResponse) => {
  res.status(400).send('Bad Request');
};
