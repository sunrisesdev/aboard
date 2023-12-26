import createResponse from '@/utils/api/createResponse';
import getSafeURLParams from '@/utils/api/getSafeUrlParams';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
  const { tag } = getSafeURLParams({
    url: request.url,
    requiredParams: ['tag'],
  });

  if (tag) {
    revalidateTag(tag);
  }

  return createResponse({
    statusCode: 200,
  });
}
