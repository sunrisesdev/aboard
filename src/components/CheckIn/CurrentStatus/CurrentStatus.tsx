import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { useContext } from 'react';
import { CheckInContext } from '../CheckIn.context';
import styles from './CurrentStatus.module.scss';

const CurrentStatus = () => {
  const { currentStatus } = useContext(CheckInContext);

  if (!currentStatus) {
    return null;
  }

  return (
    <section className={styles.base}>
      <div className={styles.origin}>
        <div className={styles.station}>{currentStatus.train.origin.name}</div>
      </div>

      <div className={styles.meta}>
        <LineIndicator
          className={styles.lineIndicator}
          lineName={currentStatus.train.lineName}
          product={currentStatus.train.category}
          productName=""
        />

        <span>{(currentStatus.train.distance / 1000).toLocaleString()} km</span>

        <span>{currentStatus.train.points} Pkt</span>
      </div>

      <div className={styles.destination}>
        <div className={styles.station}>
          {currentStatus.train.destination.name}
        </div>
      </div>
    </section>
  );
};

export default CurrentStatus;
