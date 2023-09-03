import { Stop } from '@/traewelling-sdk/types';

export const getStopsAfter = (
  plannedDeparture: string,
  stationId: string,
  stops: Stop[]
) => {
  const after = new Date(plannedDeparture).toISOString();

  const startingAt = stops.findIndex(
    ({ departurePlanned, id }) =>
      after === new Date(departurePlanned!).toISOString() &&
      stationId === id.toString()
  );

  return stops.slice(typeof startingAt === 'undefined' ? 0 : startingAt + 1);
};
