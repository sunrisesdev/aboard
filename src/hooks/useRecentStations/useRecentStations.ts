import { AutocompleteResponse } from '@/traewelling-sdk/functions/trains';
import useSWR from 'swr';

const fetcher = async (): Promise<AutocompleteResponse> => {
  const response = await fetch('/traewelling/stations/history');

  if (!response.ok) {
    return [];
  }

  return await response.json();
};

export const useRecentStations = () => {
  const { data, isLoading } = useSWR(
    ['/traewelling/stations/autocomplete'],
    ([]) => fetcher()
  );

  return {
    isLoading,
    recentStations: data,
  };
};
