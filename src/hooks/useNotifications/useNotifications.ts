import useSWR from 'swr';

const notificationsCountFetcher = async (): Promise<number> => {
  const response = await fetch('/traewelling/notifications/unread');

  if (!response.ok) {
    return 0;
  }

  return await response.json();
};

export const useNotificationsCount = () => {
  const { data, isLoading } = useSWR(
    ['/traewelling/notifications/unread'],
    ([_]) => notificationsCountFetcher()
  );

  return {
    isLoading,
    amount: data ?? 0,
  };
};
