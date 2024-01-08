'use client';
import { useNotificationsCount } from '@/hooks/useNotifications/useNotifications';
import { Suspense } from 'react';
import { MdOutlineNotifications } from 'react-icons/md';
import styles from './Notifications.module.scss';

const NotificationsBase = () => {
  const { amount } = useNotificationsCount();

  return (
    <div className={styles.base}>
      {amount !== 0 && <span className={styles.dot} />}
      <MdOutlineNotifications />
    </div>
  );
};

const Notifications = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.base}>
          <MdOutlineNotifications />
        </div>
      }
    >
      <NotificationsBase />
    </Suspense>
  );
};

export default Notifications;
