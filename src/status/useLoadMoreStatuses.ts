import ky from 'ky';
import { useState } from 'react';
import type { StatusResource } from '@/lib/traewelling';

// Appends the next page of a paginated status endpoint, which responds with `{ data, nextPage }`
export function useLoadMoreStatuses(
  endpoint: string,
  initialStatuses: StatusResource[],
  initialNextPage: number | undefined,
) {
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(initialNextPage);
  const [statuses, setStatuses] = useState(initialStatuses);

  const loadMore = async () => {
    if (loading || !nextPage) return;

    setLoading(true);

    try {
      const { data, nextPage: followingPage } = await ky
        .get(endpoint, { searchParams: { page: nextPage } })
        .json<{ data: StatusResource[]; nextPage?: number }>();

      // New check-ins shift the pages, so a status can show up on two consecutive pages
      setStatuses((previous) => [
        ...previous,
        ...data.filter(({ id }) => !previous.some((status) => status.id === id)),
      ]);
      setNextPage(followingPage);
    } finally {
      setLoading(false);
    }
  };

  return { hasMore: !!nextPage, loading, loadMore, statuses };
}
