'use client';

import { Button } from '@/components/Button/Button';
import type { StatusResource } from '@/lib/traewelling';
import statusesStyles from '@/status/Dashboard/Dashboard.module.css';
import { groupStatusesByDay } from '@/status/groupStatusesByDay';
import { StatusSummary } from '@/status/StatusSummary/StatusSummary';
import { useLoadMoreStatuses } from '@/status/useLoadMoreStatuses';
import styles from './ProfileStatuses.module.css';

export const ProfileStatuses = ({
  initialNextPage,
  initialStatuses,
  username,
}: {
  initialNextPage: number | undefined;
  initialStatuses: StatusResource[];
  username: string;
}) => {
  const { hasMore, loading, loadMore, statuses } = useLoadMoreStatuses(
    `/api/user/${encodeURIComponent(username)}/statuses`,
    initialStatuses,
    initialNextPage,
  );

  return (
    <div className={styles.days}>
      {groupStatusesByDay(statuses).map(({ day, statuses }) => (
        <section key={day}>
          <h2 className={styles.day}>{day}</h2>

          <ul className={statusesStyles.statuses}>
            {statuses.map((status) => (
              <li key={status.id}>
                <StatusSummary status={status} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {hasMore && (
        <Button disabled={loading} onClick={loadMore}>
          {loading ? 'Lädt…' : 'Mehr laden'}
        </Button>
      )}
    </div>
  );
};
