import { Status } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (id: string): Promise<Status | null> => {
  if (!id.trim()) {
    return null;
  }

  const response = await fetch(`/traewelling/statuses/${id}`);

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useStatus = (id: string) => {
  const { data, isLoading } = useSWR(['/traewelling/statuses', id], ([_, id]) =>
    fetcher(id)
  );

  return {
    isLoading,
    status: data,
  };
};
