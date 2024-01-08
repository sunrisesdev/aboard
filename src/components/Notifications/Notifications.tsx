'use client';
import { useNotificationsCount } from '@/hooks/useNotifications/useNotifications';
import { MdOutlineNotifications } from 'react-icons/md';
import styles from './Notifications.module.scss';

const Notifications = () => {
  const { amount } = useNotificationsCount();

  return (
    <div className={styles.base}>
      {amount !== 0 && <span className={styles.dot} />}
      <MdOutlineNotifications />
    </div>
  );
};

export default Notifications;
