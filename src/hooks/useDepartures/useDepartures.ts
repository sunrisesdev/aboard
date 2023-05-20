import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import { TransportType } from '@/traewelling-sdk/types';
import useSWR from 'swr';
import { UseDeparturesOptions } from './types';

const fetcher = async (
  stationName: string,
  transportType?: TransportType,
  from?: string
): Promise<DeparturesResponse> => {
  if (!stationName.trim()) {
    return { meta: null, trips: [] };
  }

  const params = new URLSearchParams();

  if (!!transportType) {
    params.append('transportType', transportType);
  }

  if (!!from) {
    params.append('from', from);
  }

  const response = await fetch(
    `/traewelling/stations/${stationName.replace(
      '/',
      '%20'
    )}?${params.toString()}`
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

export const useDepartures = (
  stationName: string,
  options?: UseDeparturesOptions
) => {
  const { data, isLoading } = useSWR(
    [
      '/traewelling/stations/',
      stationName,
      options?.transportType,
      options?.from,
    ],
    ([_, stationName, transportType, from]) =>
      fetcher(stationName, transportType, from)
  );

  return {
    departures: data,
    isLoading,
  };
};
