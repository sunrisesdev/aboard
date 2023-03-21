import { Status } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (): Promise<Status | null> => {
  const response = await fetch('/traewelling/statuses/current');

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useCurrentStatus = () => {
  const { data, isLoading, mutate } = useSWR(
    ['/traewelling/statuses/current'],
    () => fetcher()
  );

  return {
    isLoading,
    mutate,
    status: data,
  };
};
