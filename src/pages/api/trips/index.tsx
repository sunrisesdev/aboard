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

  if (!req.query.hafasTripId || !req.query.lineName || !req.query.start) {
    return badRequest(res);
  }

  try {
    const data = await TraewellingSdk.trains.trip(
      {
        hafasTripId: req.query.hafasTripId as string,
        lineName: req.query.lineName as string,
        start: req.query.start as string,
      },
      req.headers.authorization
    );
    return res.status(200).json(data);
  } catch (error: any) {
    res.status(error?.status ?? 500).json(error?.message ?? {});
  }
}
