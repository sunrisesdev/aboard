'use client';

import { useDashboard } from '@/hooks/useDashboard/useDashboard';
import { Status } from '@/traewelling-sdk/types';
import { parseSchedule } from '@/utils/parseSchedule';
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

  //sort by date
  const sortedStatuses: { dateKey: string; statuses: Status[] }[] = [];
  statuses.forEach((status) => {
    const departureSchedule = parseSchedule({
      actual:
        status.train.origin.departureReal ??
        status.train.origin.departure ??
        '',
      planned: status.train.origin.departurePlanned ?? '',
    });
    const date = new Date(departureSchedule.actualValue);
    const dateKey = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`;

    const existingDate = sortedStatuses.find((s) => s.dateKey === dateKey);
    if (existingDate) {
      existingDate.statuses.push(status);
    } else {
      sortedStatuses.push({
        dateKey,
        statuses: [status],
      });
    }
  });

  return (
    <div>
      {sortedStatuses.map((s) => (
        <div key={s.dateKey} className={styles.base}>
          <div className={styles.date}>
            <hr />
            <span>{s.dateKey}</span>
            <hr />
          </div>
          {s.statuses.map((status) => (
            <StatusCard key={status.id} status={status} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Statuses;
