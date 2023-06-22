'use client';

import { useDashboard } from '@/hooks/useDashboard/useDashboard';
import { Status } from '@/traewelling-sdk/types';
import { formatDate } from '@/utils/formatDate';
import StatusCard from '../StatusCard/StatusCard';
import styles from './Statuses.module.scss';

const Statuses = () => {
  const { isLoading, statuses } = useDashboard();

  if (isLoading) {
    return (
      <div className={styles.base}>
        <StatusCard.Skeleton />
        <StatusCard.Skeleton />
        <StatusCard.Skeleton />
        <StatusCard.Skeleton />
        <StatusCard.Skeleton />
      </div>
    );
  }

  if (!statuses?.length) {
    return <div className={styles.base}>Keine Daten vorhanden</div>;
  }

  //helper function to get dateKey from status departureTime
  const getDateKey = (status: Status) => {
    const date = new Date(
      status.train.origin.departureReal ?? status.train.origin.departure ?? ''
    );
    //remove time from date
    date.setHours(0, 0, 0, 0);
    return date;
  };

  //Group statuses by date
  const groupedStatuses: { dateKey: Date; statuses: Status[] }[] = [];

  statuses.forEach((status) => {
    //get Date of status and check if it already exists in groupedStatuses
    const dateKey = getDateKey(status);
    const existingDate = groupedStatuses.find(
      (group) => group.dateKey.toDateString() === dateKey.toDateString()
    );
    if (existingDate) {
      existingDate.statuses.push(status);
    } else {
      groupedStatuses.push({
        dateKey,
        statuses: [status],
      });
    }
  });

  return (
    <div>
      {groupedStatuses.map((group) => (
        <div className={styles.base} key={group.dateKey.toDateString()}>
          <span className={styles.date}>{formatDate(group.dateKey)}</span>
          <div className={styles.statusGroup}>
            {group.statuses.map((status) => (
              <StatusCard key={status.id} status={status} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statuses;
