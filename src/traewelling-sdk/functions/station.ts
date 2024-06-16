import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { HAFASTrip } from '../hafasTypes';
import { TransportType } from '../types';

type DeparturesInput = {
  id: number;
  travelType?: TransportType;
  when?: string;
};

export type DeparturesResponse = {
  meta: {
    station: {
      ibnr: number;
      id: number;
      latitude: string;
      longitude: string;
      name: string;
      rilIdentifier: string | null;
    };
    times: {
      next: string;
      now: string;
      prev: string;
    };
  } | null;
  trips: HAFASTrip[];
};

export const departures = async (input: DeparturesInput) => {
  const session = await getServerSession(authOptions);

  const url = new URL(
    `https://traewelling.de/api/v1/station/${input.id}/departures`
  );

  if (!!input.travelType) {
    url.searchParams.append('travelType', input.travelType);
  }

  if (!!input.when) {
    url.searchParams.append('when', input.when);
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    cache: 'no-store',
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: trips, meta } = data;

    return {
      meta,
      trips,
    } as DeparturesResponse;
  }

  throw { message: data, status: res.status };
};
