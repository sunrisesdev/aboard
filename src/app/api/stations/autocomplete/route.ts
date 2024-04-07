import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { transformTrwlStation } from '@/traewelling-sdk/transformers';
import { AboardStation } from '@/types/aboard';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import getSafeURLParams from '@/utils/api/getSafeUrlParams';
import { getServerSession } from 'next-auth';

export type AboardAutocompleteResponse = AboardStation[];

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const { query } = getSafeURLParams({
      url: request.url,
      requiredParams: ['query'],
    });

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    const data = await TraewellingSdk.trains.autocomplete({ query });

    return createResponse({
      body: data.map((station) =>
        transformTrwlStation({
          ...station,
          id: -1,
          latitude: -1,
          longitude: -1,
        })
      ),
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
