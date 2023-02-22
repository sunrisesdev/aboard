import { TraewellingSdk } from '@/traewelling-sdk';
import { TransportType } from '@/traewelling-sdk/types';
import { badRequest } from '@/utils/badRequest';
import { methodNotAllowed } from '@/utils/methodNotAllowed';
import { unauthorized } from '@/utils/unauthorized';
import { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_TRANSPORT_TYPES = [
  'bus',
  'express',
  'ferry',
  'regional',
  'suburban',
  'subway',
  'taxi',
  'tram',
];

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

  if (
    !((req.query.station as string) ?? '').trim() ||
    (!!req.query.transportType &&
      !ALLOWED_TRANSPORT_TYPES.includes(req.query.transportType as string))
  ) {
    return badRequest(res);
  }

  try {
    const data = await TraewellingSdk.trains.departures(
      {
        name: req.query.station as string,
        travelType: req.query.transportType as TransportType,
        when: req.query.from as string,
      },
      req.headers.authorization
    );
    return res.status(200).json(data);
  } catch (error: any) {
    res.status(error?.status ?? 500).json(error?.message ?? {});
  }
}
