import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = async (
  stationName: string,
  session?: Session | null
): Promise<DeparturesResponse> => {
  const token = session?.user.accessToken;

  if (!stationName.trim() || !token) {
    return { meta: null, trips: [] };
  }

  const response = await fetch(
    `/api/stations/${stationName.replace('/', '%20')}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

export const useDepartures = (stationName: string) => {
  const { data: session } = useSession();
  const { data, isLoading } = useSWR(
    ['/api/stations/', stationName, session],
    ([_, stationName, session]) => fetcher(stationName, session)
  );

  return {
    departures: data,
    isLoading,
  };
};
