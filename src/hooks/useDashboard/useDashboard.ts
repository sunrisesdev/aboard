import { Status } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (): Promise<Status[] | null> => {
  const response = await fetch('/traewelling/statuses');

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useDashboard = () => {
  const { data, isLoading } = useSWR(['/traewelling/statuses'], ([_]) =>
    fetcher()
  );

  return {
    isLoading,
    statuses: data,
  };
};
