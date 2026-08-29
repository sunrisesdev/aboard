import { Stopover } from '@/traewelling-sdk/types';

export const getStopsAfter = (
  plannedDeparture: string,
  stationId: number,
  stops: Stopover[]
) => {
  const after = new Date(plannedDeparture).toISOString();

  const startingAt = stops.findIndex(
    ({ departurePlanned, id }) =>
      after === new Date(departurePlanned!).toISOString() &&
      stationId === id
  );

  return stops.slice(typeof startingAt === 'undefined' ? 0 : startingAt + 1);
};
