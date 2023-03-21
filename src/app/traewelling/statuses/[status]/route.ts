import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';

export async function GET(
  _request: Request,
  context: { params: { status: string } }
) {
  try {
    if (!(context.params.status ?? '').trim()) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    // CAREFUL: Authorization is optional for this function!
    const data = await TraewellingSdk.status.single({
      id: context.params.status,
    });
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
