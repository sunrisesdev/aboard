import { getStopsAfter } from '@/helpers/getStopsAfter';
import { TripResponse } from '@/traewelling-sdk/functions/trains';
import useSWR from 'swr';

const fetcher = async (
  hafasTripId: string,
  lineName: string,
): Promise<TripResponse | undefined> => {
  if (!hafasTripId || !lineName) {
    return;
  }

  const response = await fetch(
    `/traewelling/trips?hafasTripId=${encodeURIComponent(
      hafasTripId
    )}&lineName=${lineName}`
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
  stationId: number,
) => {
  const { data, isLoading } = useSWR(
    ['/traewelling/trip', hafasTripId, lineName],
    ([_, hafasTripId, lineName]) => fetcher(hafasTripId, lineName)
  );

  const stops = data && getStopsAfter(plannedDeparture, stationId, data.stopovers);

  return {
    isLoading,
    stops,
  };
};
