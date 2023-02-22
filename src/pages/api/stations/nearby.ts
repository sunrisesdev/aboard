import { TraewellingSdk } from '@/traewelling-sdk';
import { badRequest } from '@/utils/badRequest';
import { methodNotAllowed } from '@/utils/methodNotAllowed';
import { unauthorized } from '@/utils/unauthorized';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res);
  }

  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  if (!req.query.latitude || !req.query.longitude) {
    return badRequest(res);
  }

  try {
    const data = await TraewellingSdk.trains.nearby(
      {
        latitude: req.query.latitude as string,
        longitude: req.query.longitude as string,
      },
      req.headers.authorization
    );
    return res.status(200).json(data);
  } catch (error: any) {
    res.status(error?.status ?? 500).json(error?.message ?? {});
  }
}
