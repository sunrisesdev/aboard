import { TraewellingSdk } from '@/traewelling-sdk';
import { methodNotAllowed } from '@/utils/methodNotAllowed';
import { unauthorized } from '@/utils/unauthorized';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  // TODO: Add checks to fail this request early

  try {
    const data = await TraewellingSdk.trains.checkin(
      req.body,
      req.headers.authorization
    );
    return res.status(200).json(data);
  } catch (error: any) {
    res.status(error?.status ?? 500).json(error?.message ?? {});
  }
}
