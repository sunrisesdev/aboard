import { NewLineIndicator } from '@/components/NewLineIndicator/NewLineIndicator';
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
    actual:
      currentStatus.journey.manualArrival ??
      currentStatus.journey.destination.arrival.actual,
    planned: currentStatus.journey.destination.arrival.planned!,
  });

  const departureSchedule = parseSchedule({
    actual:
      currentStatus.journey.manualDeparture ??
      currentStatus.journey.origin.departure.actual,
    planned: currentStatus.journey.origin.departure.planned!,
  });

  return (
    <section className={styles.base}>
      <div className={styles.origin}>
        <div className={styles.station}>
          <span>{currentStatus.journey.origin.station.name}</span>
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
        <NewLineIndicator line={currentStatus.journey.line} />

        <div className={styles.metaText}>
          <TbRoute size={18} />
          <span>{Math.ceil(currentStatus.journey.distance / 1000)} km</span>
        </div>

        <div className={styles.metaText}>
          <MdOutlineToken size={18} />
          <span>{currentStatus.journey.pointsAwarded}</span>
        </div>
      </div>

      <div className={styles.destination}>
        <div className={styles.station}>
          <span>{currentStatus.journey.destination.station.name}</span>
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
