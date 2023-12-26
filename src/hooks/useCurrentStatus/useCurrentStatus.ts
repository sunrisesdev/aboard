import { AboardCurrentStatusResponse } from '@/app/api/statuses/current/route';
import useSWR from 'swr';

const fetcher = async (): Promise<AboardCurrentStatusResponse> => {
  const response = await fetch('/api/statuses/current');

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useCurrentStatus = () => {
  const { data, isLoading, mutate } = useSWR(['/api/statuses/current'], () =>
    fetcher()
  );

  return {
    isLoading,
    mutate,
    status: data,
  };
};
