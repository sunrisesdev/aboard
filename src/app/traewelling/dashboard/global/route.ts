import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';

export async function GET(request: Request) {
  try {
    const data = await TraewellingSdk.dashboard.global();
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
