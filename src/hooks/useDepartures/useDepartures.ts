import { AboardDeparturesResponse } from '@/app/api/stations/[station]/route';
import { TransportType } from '@/traewelling-sdk/types';
import useSWR from 'swr';
import { UseDeparturesOptions } from './types';

const fetcher = async (
  stationId?: number,
  transportType?: TransportType,
  from?: string
): Promise<AboardDeparturesResponse> => {
  if (typeof stationId === 'undefined') {
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
    `/api/stations/${stationId}?${params.toString()}`
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

export const useDepartures = (
  stationId?: number,
  options?: UseDeparturesOptions
) => {
  const { data, isLoading } = useSWR(
    ['/api/stations/', stationId, options?.transportType, options?.from],
    ([_, stationId, transportType, from]) =>
      fetcher(stationId, transportType, from)
  );

  return {
    departures: data,
    isLoading,
  };
};
