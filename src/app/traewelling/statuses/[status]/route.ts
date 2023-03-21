import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import { getServerSession } from 'next-auth';

export async function GET(
  _request: Request,
  context: { params: { status: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!(context.params.status ?? '').trim()) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    // CAREFUL: Authorization is optional for this function!
    const data = await TraewellingSdk.status.single(
      {
        id: context.params.status,
      },
      !session ? undefined : `Bearer ${session.user.accessToken}`
    );
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
