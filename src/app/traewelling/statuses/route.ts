import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';

export async function GET(request: Request) {
  try {
    // CAREFUL: Authorization is optional for this function!
    const data = await TraewellingSdk.status.dashboard();

    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
