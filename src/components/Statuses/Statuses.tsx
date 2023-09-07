'use client';

import { useDashboard } from '@/hooks/useDashboard/useDashboard';
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

  return (
    <div className={styles.base}>
      {statuses.map((status) => (
        <StatusCard key={status.id} status={status} />
      ))}
    </div>
  );
};

export default Statuses;
