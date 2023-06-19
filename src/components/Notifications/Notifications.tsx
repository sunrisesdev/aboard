'use client';
import { useNotifications } from '@/hooks/useNotifications/useNotifications';
import { MdOutlineNotifications } from 'react-icons/md';
import styles from './Notifications.module.scss';

const Notifications = () => {
  const { amount } = useNotifications();

  return (
    <div className={styles.base}>
      {amount !== 0 && <span className={styles.dot} />}
      <MdOutlineNotifications />
    </div>
  );
};

export default Notifications;
