import { identifyLineByMagic } from '@/helpers/identifyLineByMagic';
import { createLineAppearanceDataset } from '@/helpers/lineAppearance';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { transformTrwlStatus } from '@/traewelling-sdk/transformers';
import { AboardStatus } from '@/types/aboard';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import { getServerSession } from 'next-auth';

export type AboardDashboardResponse = AboardStatus[] | null;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    const data = await TraewellingSdk.dashboard.personal();

    const transformedData: AboardDashboardResponse =
      data?.map(transformTrwlStatus) ?? null;

    if (!transformedData) {
      return createResponse({
        body: transformedData,
      });
    }

    const { getAppearanceForLine } = await createLineAppearanceDataset();

    transformedData.forEach((status) => {
      status.journey.line.appearance = getAppearanceForLine(
        identifyLineByMagic(status.journey.hafasTripId, status.journey.line)
      );
    });

    return createResponse({
      body: transformedData,
    });
  } catch (error) {
    return createErrorResponse({ error });
  }
}
