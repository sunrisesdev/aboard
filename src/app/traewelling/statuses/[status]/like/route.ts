import { TraewellingSdk } from '@/traewelling-sdk';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';

export async function POST(
  _request: Request,
  context: { params: Promise<{ status: string }> }
) {
  try {
    const { status } = await context.params;

    if (!(status ?? '').trim()) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    const data = await TraewellingSdk.status.like({
      id: status,
      method: 'POST',
    });
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ status: string }> }
) {
  try {
    const { status } = await context.params;

    if (!(status ?? '').trim()) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    const data = await TraewellingSdk.status.like({
      id: status,
      method: 'DELETE',
    });
    return createResponse({
      body: data,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
