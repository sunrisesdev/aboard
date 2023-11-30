import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { parseSchedule } from '@/utils/parseSchedule';
import { useContext } from 'react';
import { MdOutlineToken } from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import styles from './CurrentStatus.module.scss';

const CurrentStatus = () => {
  const { currentStatus } = useContext(CheckInContext);

  if (!currentStatus) {
    return null;
  }

  const arrivalSchedule = parseSchedule({
    actual: currentStatus.train.destination.arrival,
    planned: currentStatus.train.destination.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: currentStatus.train.origin.departure,
    planned: currentStatus.train.origin.departurePlanned!,
  });

  return (
    <section className={styles.base}>
      <div className={styles.origin}>
        <div className={styles.station}>
          <span>{currentStatus.train.origin.name}</span>
          <span className={styles.time}>
            ab {departureSchedule.planned}
            {!departureSchedule.isOnTime && (
              <span className={styles.delay}>
                &nbsp;<sup>+{departureSchedule.delayInMinutes}</sup>
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.meta}>
        <LineIndicator
          className={styles.lineIndicator}
          isInverted
          lineId={currentStatus.train.number}
          lineName={currentStatus.train.lineName}
          product={currentStatus.train.category}
        />

        <div className={styles.metaText}>
          <TbRoute size={18} />
          <span>{Math.ceil(currentStatus.train.distance / 1000)} km</span>
        </div>

        <div className={styles.metaText}>
          <MdOutlineToken size={18} />
          <span>{currentStatus.train.points}</span>
        </div>
      </div>

      <div className={styles.destination}>
        <div className={styles.station}>
          <span>{currentStatus.train.destination.name}</span>
          <span className={styles.time}>
            an {arrivalSchedule.planned}
            {!arrivalSchedule.isOnTime && (
              <span className={styles.delay}>
                &nbsp;<sup>+{arrivalSchedule.delayInMinutes}</sup>
              </span>
            )}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CurrentStatus;
