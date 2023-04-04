import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';

export async function GET(
  request: Request,
  context: { params: { username: string } }
) {
  try {
    const data = await TraewellingSdk.user.getStatuses(context.params.username);

    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
