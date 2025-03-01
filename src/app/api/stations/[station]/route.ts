import { identifyLineByMagic } from '@/helpers/identifyLineByMagic';
import { createLineAppearanceDataset } from '@/helpers/lineAppearance';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { TraewellingSdk } from '@/traewelling-sdk';
import { transformHAFASTrip } from '@/traewelling-sdk/transformers';
import { TransportType } from '@/traewelling-sdk/types';
import { AboardStation, AboardTrip } from '@/types/aboard';
import createErrorResponse from '@/utils/api/createErrorResponse';
import createResponse from '@/utils/api/createResponse';
import getSafeURLParams from '@/utils/api/getSafeUrlParams';
import { getServerSession } from 'next-auth';

const ALLOWED_TRANSPORT_TYPES = [
  'bus',
  'express',
  'ferry',
  'regional',
  'suburban',
  'subway',
  'taxi',
  'tram',
];

export type AboardDeparturesResponse = {
  meta: {
    station: AboardStation;
    times: {
      next: string;
      now: string;
      prev: string;
    };
  } | null;
  trips: AboardTrip[];
};

export async function GET(
  request: Request,
  context: { params: { station: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const { transportType, from } = getSafeURLParams({
      url: request.url,
      optionalParams: ['transportType', 'from'],
      requiredParams: [],
    });

    if (!session) {
      return createErrorResponse({
        error: 'No session',
        statusCode: 401,
      });
    }

    if (
      !(context.params.station ?? '').trim() ||
      (!!transportType && !ALLOWED_TRANSPORT_TYPES.includes(transportType))
    ) {
      return createErrorResponse({
        error: 'Invalid parameters',
        statusCode: 400,
      });
    }

    const data = await TraewellingSdk.station.departures({
      id: +context.params.station,
      travelType: transportType as TransportType,
      when: from,
    });

    const { getAppearanceForLine } = await createLineAppearanceDataset();

    const transformedData: AboardDeparturesResponse = {
      meta: data.meta && {
        station: {
          evaId: data.meta.station.id,
          ibnr: data.meta.station.ibnr,
          latitude: +data.meta.station.latitude,
          longitude: +data.meta.station.longitude,
          name: data.meta.station.name,
          rilId: data.meta.station.rilIdentifier ?? undefined,
          trwlId: undefined,
        } as AboardStation,
        times: data.meta?.times,
      },
      trips: data.trips.map(transformHAFASTrip),
    };

    transformedData.trips.forEach((trip) => {
      trip.line.appearance = getAppearanceForLine(
        identifyLineByMagic(trip.hafasId, trip.line)
      );
    });

    return createResponse({
      body: transformedData,
    });
  } catch (error) {
    console.log(error);

    return createErrorResponse({ error });
  }
}
