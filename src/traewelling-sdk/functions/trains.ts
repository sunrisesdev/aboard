import { HAFASTrip } from '../hafasTypes';
import { Station, TransportType, Trip } from '../types';

type AutocompleteInput = {
  query: string;
};

export const autocomplete = async (
  input: AutocompleteInput,
  bearerToken: string
) => {
  const url = new URL(
    `https://traewelling.de/api/v1/trains/station/autocomplete/${input.query
      .trim()
      .replaceAll(/\/|%2F/g, '%20')}`
  );

  const res = await fetch(url, {
    headers: {
      Authorization: bearerToken,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: stations } = data;

    return stations as Pick<Station, 'ibnr' | 'name' | 'rilIdentifer'>[];
  }

  throw { message: data, status: res.status };
};

type CheckinInput = {
  arrival: string;
  body: string | null;
  business: 0 | 1 | 2;
  chainPost: boolean | null;
  departure: string;
  destination: number;
  eventId: number | null;
  force: boolean | null;
  ibnr: boolean | null;
  lineName: string;
  start: number;
  toot: boolean | null;
  tripId: string;
  tweet: boolean | null;
  visibility: 0 | 1 | 2 | 3 | 4;
};

export const checkin = async (input: CheckinInput, bearerToken: string) => {
  const res = await fetch('https://traewelling.de/api/v1/trains/checkin', {
    body: JSON.stringify(input),
    headers: {
      Authorization: bearerToken,
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

export const departures = async (
  input: DeparturesInput,
  bearerToken: string
) => {
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
      Authorization: bearerToken,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    const { data: trips, meta } = data;

    return {
      meta: meta as {
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
      },
      trips: trips as HAFASTrip[],
    };
  }

  throw { message: data, status: res.status };
};

type TripInput = {
  hafasTripId: string;
  lineName: string;
  start: string;
};

export const trip = async (input: TripInput, bearerToken: string) => {
  const url = new URL('https://traewelling.de/api/v1/trains/trip/');

  url.searchParams.append('hafasTripId', input.hafasTripId);
  url.searchParams.append('lineName', input.lineName);
  url.searchParams.append('start', input.start);

  const res = await fetch(url, {
    headers: {
      Authorization: bearerToken,
    },
    method: 'GET',
  });

  const data = await res.json();

  if (res.status === 200) {
    return data.data as Trip;
  }

  throw { message: data, status: res.status };
};
