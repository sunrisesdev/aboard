import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const body = (await request.json()) as CheckinInput;

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    if (!body) {
      return createErrorResponse({
        error: 'No body',
        statusCode: 400,
      });
    }

    const data = await TraewellingSdk.trains.checkin(
      body,
      `Bearer ${session.user.accessToken}`
    );
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
