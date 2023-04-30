import { Status } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (): Promise<Status[] | null> => {
  const response = await fetch('/traewelling/dashboard');

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useDashboard = () => {
  const { data, isLoading } = useSWR(['/traewelling/dashboard'], ([_]) =>
    fetcher()
  );

  return {
    isLoading,
    statuses: data,
  };
};
