import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { HAFASTrip } from '../hafasTypes';
import { Station, TransportType, Trip } from '../types';

type AutocompleteInput = {
  query: string;
};

export type AutocompleteResponse = Pick<
  Station,
  'ibnr' | 'name' | 'rilIdentifier'
>[];

export const autocomplete = async (input: AutocompleteInput) => {
  const session = await getServerSession(authOptions);

  const url = new URL(
    `https://traewelling.de/api/v1/trains/station/autocomplete/${input.query
      .trim()
      .replaceAll(/\/|%2F/g, '%20')}`
  );

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: stations } = data;

    return stations as AutocompleteResponse;
  }

  throw { message: data, status: res.status };
};

export type CheckinInput = {
  arrival: string;
  body?: string;
  business: number; // 0 | 1 | 2
  chainPost?: boolean;
  departure: string;
  destination: number;
  eventId?: number;
  force?: boolean;
  ibnr?: boolean;
  lineName: string;
  start: number;
  toot?: boolean;
  tripId: string;
  tweet?: boolean;
  visibility: number; // 0 | 1 | 2 | 3 | 4
};

export const checkin = async (input: CheckinInput) => {
  const session = await getServerSession(authOptions);

  const res = await fetch('https://traewelling.de/api/v1/trains/checkin', {
    body: JSON.stringify(input),
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const data = await res.json();

  if (res.status === 201) {
    const { alsoOnThisConnection, points, status } = data;

    return {
      // TODO: Types
      alsoOnThisConnection: alsoOnThisConnection as any[],
      points,
      status,
    };
  }

  throw { message: data, status: res.status };
};

type DeparturesInput = {
  name: string;
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
    `https://traewelling.de/api/v1/trains/station/${input.name
      .trim()
      .replaceAll(/\/|%2F/g, '%20')}/departures`
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
    next: {
      revalidate: 60,
    },
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

export const history = async () => {
  const session = await getServerSession(authOptions);

  const url = new URL('https://traewelling.de/api/v1/trains/station/history');

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: stations } = data;

    return stations as Station[];
  }

  throw { message: data, status: res.status };
};

type NearbyInput = {
  latitude: string;
  longitude: string;
};

export type NearbyResponse = Station;

export const nearby = async (input: NearbyInput) => {
  const session = await getServerSession(authOptions);

  const url = new URL('https://traewelling.de/api/v1/trains/station/nearby');

  url.searchParams.append('latitude', input.latitude);
  url.searchParams.append('longitude', input.longitude);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: stations } = data;

    return stations as Station;
  }

  throw { message: data, status: res.status };
};

type TripInput = {
  hafasTripId: string;
  lineName: string;
  start: string;
};

export type TripResponse = Trip;

export const trip = async (input: TripInput) => {
  const session = await getServerSession(authOptions);

  const url = new URL('https://traewelling.de/api/v1/trains/trip/');

  url.searchParams.append('hafasTripId', input.hafasTripId);
  url.searchParams.append('lineName', input.lineName);
  url.searchParams.append('start', input.start);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user.accessToken}`,
    },
    method: 'GET',
    next: {
      revalidate: 60,
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as TripResponse;
  }

  throw { message: data, status: res.status };
};
