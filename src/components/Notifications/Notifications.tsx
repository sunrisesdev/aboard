'use client';
import { useNotificationsCount } from '@/hooks/useNotifications/useNotifications';
import Link from 'next/link';
import { Suspense } from 'react';
import { MdOutlineNotifications } from 'react-icons/md';
import styles from './Notifications.module.scss';

const NotificationsBase = () => {
  const { amount } = useNotificationsCount();

  return (
    <Link className={styles.base} href="https://traewelling.de">
      {amount !== 0 && <span className={styles.dot} />}
      <MdOutlineNotifications />
    </Link>
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
