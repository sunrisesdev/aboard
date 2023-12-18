import { AboardDashboardResponse } from '@/app/api/dashboard/route';
import useSWR from 'swr';

const fetcher = async (): Promise<AboardDashboardResponse> => {
  const response = await fetch('/api/dashboard');

  if (!response.ok) {
    return null;
  }

  return await response.json();
};

export const useDashboard = () => {
  const { data, isLoading } = useSWR(['/api/dashboard'], ([_]) => fetcher());

  return {
    isLoading,
    statuses: data,
  };
};
