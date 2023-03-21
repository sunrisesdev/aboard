import { TripResponse } from '@/traewelling-sdk/functions/trains';
import useSWR from 'swr';

const fetcher = async (
  hafasTripId: string,
  lineName: string,
  start: string
): Promise<TripResponse | undefined> => {
  if (!hafasTripId || !lineName || !start.trim()) {
    return;
  }

  const response = await fetch(
    `/traewelling/trips?hafasTripId=${hafasTripId}&lineName=${lineName}&start=${start.replace(
      '/',
      '%20'
    )}`
  );

  if (!response.ok) {
    return;
  }

  return await response.json();
};

export const useStops = (
  hafasTripId: string,
  lineName: string,
  plannedDeparture: string,
  start: string
) => {
  const { data, isLoading } = useSWR(
    ['/traewelling/trips', hafasTripId, lineName, start],
    ([_, hafasTripId, lineName, start]) => fetcher(hafasTripId, lineName, start)
  );

  const startingAt = data?.stopovers.findIndex(
    ({ departurePlanned, id }) =>
      plannedDeparture === departurePlanned && start === id.toString()
  );

  const stops =
    data?.stopovers.slice(
      typeof startingAt === 'undefined' ? 0 : startingAt + 1
    ) ?? [];

  return {
    isLoading,
    stops,
  };
};
