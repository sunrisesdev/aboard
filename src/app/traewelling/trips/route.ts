import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import getSafeURLParams from '@/utils/api/getSafeUrlParams';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  try {
    const { hafasTripId, lineName, start } = getSafeURLParams({
      url: request.url,
      requiredParams: ['hafasTripId', 'lineName', 'start'],
    });

    const session = await getServerSession(authOptions);

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }
    const data = await TraewellingSdk.trains.trip({
      hafasTripId,
      lineName,
      start,
    });

    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
