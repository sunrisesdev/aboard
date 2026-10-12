'use client';

import ky from 'ky';
import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import type { StatusResource } from '@/lib/traewelling';
import { StatusSummary } from '@/status/StatusSummary/StatusSummary';
import styles from './Dashboard.module.css';

export const Dashboard = ({
  initialNextPage,
  initialStatuses,
}: {
  initialNextPage: number | undefined;
  initialStatuses: StatusResource[];
}) => {
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(initialNextPage);
  const [statuses, setStatuses] = useState(initialStatuses);

  const loadMore = async () => {
    if (loading || !nextPage) return;

    setLoading(true);

    try {
      const { data, nextPage: followingPage } = await ky
        .get('/api/dashboard', { searchParams: { page: nextPage } })
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

  return (
    <div>
      <ul className={styles.statuses}>
        {statuses.map((status) => (
          <li key={status.id}>
            <StatusSummary status={status} />
          </li>
        ))}
      </ul>

      {nextPage && (
        <Button disabled={loading} onClick={loadMore}>
          {loading ? 'Lädt…' : 'Mehr laden'}
        </Button>
      )}
    </div>
  );
};
