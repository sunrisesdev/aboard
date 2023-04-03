import { Status } from '@/traewelling-sdk/types';
import useSWR from 'swr';

const fetcher = async (username: string): Promise<Status[] | null> => {
  if (!username.trim()) {
    return null;
  }

  const response = await fetch(`/traewelling/user/${username}/statuses`);

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useUserStatuses = (username: string) => {
  const { data, isLoading } = useSWR(
    [`/traewelling/user/${username}/statuses`, username],
    ([_, username]) => fetcher(username)
  );

  return {
    isLoading,
    statuses: data,
  };
};
