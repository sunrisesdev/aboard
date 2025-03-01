import { identifyLineByMagic } from '@/helpers/identifyLineByMagic';
import { createLineAppearanceDataset } from '@/helpers/lineAppearance';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { transformTrwlStatus } from '@/traewelling-sdk/transformers';
import { AboardStatus } from '@/types/aboard';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import { getServerSession } from 'next-auth';

export type AboardCurrentStatusResponse = AboardStatus | null;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    const data = await TraewellingSdk.user.activeStatus();

    const transformedData: AboardCurrentStatusResponse = !data
      ? null
      : transformTrwlStatus(data);

    if (!transformedData) {
      return createResponse({
        body: transformedData,
      });
    }

    const { getAppearanceForLine } = await createLineAppearanceDataset();

    transformedData.journey.line.appearance = getAppearanceForLine(
      identifyLineByMagic(
        transformedData.journey.hafasTripId,
        transformedData.journey.line
      )
    );

    return createResponse({
      body: transformedData,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
