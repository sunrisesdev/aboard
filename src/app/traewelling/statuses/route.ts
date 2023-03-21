import createResponse from '@/utils/api/createResponse';

export async function GET(request: Request) {
  return createResponse({
    body: 'Hello World!',
  });
}
