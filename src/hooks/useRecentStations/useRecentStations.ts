import { AutocompleteResponse } from '@/traewelling-sdk/functions/trains';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = async (
  session?: Session | null
): Promise<AutocompleteResponse> => {
  const token = session?.user.accessToken;

  if (!token) {
    return [];
  }

  const response = await fetch('/api/stations/history', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

export const useRecentStations = () => {
  const { data: session } = useSession();
  const { data, isLoading } = useSWR(
    ['/api/stations/autocomplete', session],
    ([, session]) => fetcher(session)
  );

  return {
    isLoading,
    recentStations: data,
  };
};
