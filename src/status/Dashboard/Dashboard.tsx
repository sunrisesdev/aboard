'use client';

import { Button } from '@/components/Button/Button';
import type { StatusResource } from '@/lib/traewelling';
import { StatusSummary } from '@/status/StatusSummary/StatusSummary';
import { useLoadMoreStatuses } from '@/status/useLoadMoreStatuses';
import styles from './Dashboard.module.css';

export const Dashboard = ({
  initialNextPage,
  initialStatuses,
}: {
  initialNextPage: number | undefined;
  initialStatuses: StatusResource[];
}) => {
  const { hasMore, loading, loadMore, statuses } = useLoadMoreStatuses(
    '/api/dashboard',
    initialStatuses,
    initialNextPage,
  );

  return (
    <div>
      <ul className={styles.statuses}>
        {statuses.map((status) => (
          <li key={status.id}>
            <StatusSummary status={status} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <Button disabled={loading} onClick={loadMore}>
          {loading ? 'Lädt…' : 'Mehr laden'}
        </Button>
      )}
    </div>
  );
};
