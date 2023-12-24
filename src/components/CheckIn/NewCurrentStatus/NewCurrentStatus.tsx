import { NewLineIndicator } from '@/components/NewLineIndicator/NewLineIndicator';
import { Time } from '@/components/Time/Time';
import { radioCanada } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useContext } from 'react';
import { MdOutlineToken } from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import styles from './NewCurrentStatus.module.scss';

export const NewCurrentStatus = () => {
  const { currentStatus } = useContext(CheckInContext);

  if (!currentStatus) {
    return null;
  }

  const { journey } = currentStatus;

  const arrivalSchedule = parseSchedule({
    actual: journey.manualArrival ?? journey.destination.arrival.actual,
    planned: journey.destination.arrival.planned!,
  });

  const departureSchedule = parseSchedule({
    actual: journey.manualDeparture ?? journey.origin.departure.actual,
    planned: journey.origin.departure.planned!,
  });
  const travelTime =
    arrivalSchedule.actualValue - departureSchedule.actualValue;
  const timePassed = Date.now() - departureSchedule.actualValue;
  const progress = Math.max(0, Math.min(timePassed * (100 / travelTime), 100));

  return (
    <section
      className={clsx(radioCanada.className, styles.base)}
      style={{ ['--progress' as any]: `${progress}%` }}
    >
      <div className={styles.metadataContainer}>
        <NewLineIndicator line={journey.line} />

        <div className={styles.metadata}>
          <TbRoute size={18} />
          <span>{Math.ceil(journey.distance / 1000)} km</span>
        </div>

        <div className={styles.metadata}>
          <MdOutlineToken size={18} />
          <span>{journey.pointsAwarded}</span>
        </div>
      </div>

      <div className={styles.destination}>
        <div className={styles.decoration}>
          <div className={styles.line} />
          <div className={styles.stopIndicator} />
        </div>

        <span className={styles.station}>
          {journey.destination.station.name}
        </span>

        <Time
          className={styles.time}
          delayStyle="p+d"
          schedule={arrivalSchedule}
          type="arrival"
        />
      </div>
    </section>
  );
};
