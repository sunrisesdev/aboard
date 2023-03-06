import { Status } from '@/traewelling-sdk/types';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

const fetcher = async (session?: Session | null): Promise<Status | null> => {
  const token = session?.user.accessToken;

  if (!token) {
    return null;
  }

  const response = await fetch('/api/statuses/current', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useCurrentStatus = () => {
  const { data: session } = useSession();
  const { data, isLoading, mutate } = useSWR(
    ['/api/statuses/current', session],
    ([, session]) => fetcher(session)
  );

  return {
    isLoading,
    mutate,
    status: data,
  };
};
