import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import useSWR from 'swr';

const fetcher = async (stationName: string): Promise<DeparturesResponse> => {
  if (!stationName.trim()) {
    return { meta: null, trips: [] };
  }

  const response = await fetch(
    `/traewelling/stations/${stationName.replace('/', '%20')}`
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

export const useDepartures = (stationName: string) => {
  const { data, isLoading } = useSWR(
    ['/traewelling/stations/', stationName],
    ([_, stationName]) => fetcher(stationName)
  );

  return {
    departures: data,
    isLoading,
  };
};
