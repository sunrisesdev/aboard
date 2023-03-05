import { TripResponse } from '@/traewelling-sdk/functions/trains';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = async (
  hafasTripId: string,
  lineName: string,
  start: string,
  session?: Session | null
): Promise<TripResponse | undefined> => {
  const token = session?.user.accessToken;

  if (!hafasTripId || !lineName || !start.trim() || !token) {
    return;
  }

  const response = await fetch(
    `/api/trips?hafasTripId=${hafasTripId}&lineName=${lineName}&start=${start.replace(
      '/',
      '%20'
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
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
  const { data: session } = useSession();
  const { data, isLoading } = useSWR(
    ['/api/trips', hafasTripId, lineName, start, session],
    ([_, hafasTripId, lineName, start, session]) =>
      fetcher(hafasTripId, lineName, start, session)
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
