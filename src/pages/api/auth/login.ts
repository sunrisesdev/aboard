import { auth } from '@/traewelling-client';
import { badRequest } from '@/utils/badRequest';
import { methodNotAllowed } from '@/utils/methodNotAllowed';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  if (!('login' in req.body) || !('password' in req.body)) {
    return badRequest(res);
  }

  try {
    const data = await auth.login(req.body);
    return res.status(200).json(data);
  } catch (error: any) {
    res.status(error?.status ?? 400).json(error?.message ?? {});
  }
}
