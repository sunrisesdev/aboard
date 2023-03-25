import { Stop } from '@/traewelling-sdk/types';

export const getStopsAfter = (
  plannedDeparture: string,
  stationId: string,
  stops: Stop[]
) => {
  const startingAt = stops.findIndex(
    ({ departurePlanned, id }) =>
      plannedDeparture === departurePlanned && stationId === id.toString()
  );

  return stops.slice(typeof startingAt === 'undefined' ? 0 : startingAt + 1);
};
