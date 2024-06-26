import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { TransportType } from '@/traewelling-sdk/types';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import getSafeURLParams from '@/utils/api/getSafeUrlParams';
import { getServerSession } from 'next-auth';

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

export async function GET(
  request: Request,
  context: { params: { station: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const { transportType, from } = getSafeURLParams({
      url: request.url,
      optionalParams: ['transportType', 'from'],
      requiredParams: [],
    });

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    if (
      !(context.params.station ?? '').trim() ||
      (!!transportType && !ALLOWED_TRANSPORT_TYPES.includes(transportType))
    ) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    const data = await TraewellingSdk.station.departures({
      id: +context.params.station,
      travelType: transportType as TransportType,
      when: from,
    });
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
