import { HAFASTrip } from '../hafasTypes';
import { Station, TransportType } from '../types';

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
