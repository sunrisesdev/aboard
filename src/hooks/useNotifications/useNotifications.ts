import useSWR from 'swr';

const fetcher = async (): Promise<number> => {
  const response = await fetch('/traewelling/notifications/unread');

  if (!response.ok) {
    return 0;
  }

  return await response.json();
};

export const useNotifications = () => {
  const { data, isLoading } = useSWR(
    ['/traewelling/notifications/unread'],
    ([_]) => fetcher()
  );

  return {
    isLoading,
    amount: data ?? 0,
  };
};
