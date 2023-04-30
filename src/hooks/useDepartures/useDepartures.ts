import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import { TransportType } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (
  stationName: string,
  transportType?: TransportType
): Promise<DeparturesResponse> => {
  if (!stationName.trim()) {
    return { meta: null, trips: [] };
  }

  const response = await fetch(
    `/traewelling/stations/${stationName.replace('/', '%20')}${
      !transportType ? '' : `?transportType=${transportType}`
    }`
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

export const useDepartures = (
  stationName: string,
  transportType?: TransportType
) => {
  const { data, isLoading } = useSWR(
    ['/traewelling/stations/', stationName, transportType],
    ([_, stationName, transportType]) => fetcher(stationName, transportType)
  );

  return {
    departures: data,
    isLoading,
  };
};
