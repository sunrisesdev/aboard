import LineIndicator from '@/components/LineIndicator/LineIndicator';
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

  const arrival =
    (!!currentStatus.train.destination.arrivalPlanned &&
      new Date(currentStatus.train.destination.arrivalPlanned)) ||
    undefined;

  const arrivalTime = arrival?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const arrivalDelay =
    (arrival &&
      !!currentStatus.train.destination.arrival &&
      Math.floor(
        Math.abs(
          arrival.getTime() -
            new Date(currentStatus.train.destination.arrival).getTime()
        ) /
          1000 /
          60
      )) ||
    0;

  const departure =
    (!!currentStatus.train.origin.departurePlanned &&
      new Date(currentStatus.train.origin.departurePlanned)) ||
    undefined;

  const departureTime = departure?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const departureDelay =
    (departure &&
      !!currentStatus.train.origin.departure &&
      Math.floor(
        Math.abs(
          departure.getTime() -
            new Date(currentStatus.train.origin.departure).getTime()
        ) /
          1000 /
          60
      )) ||
    0;

  return (
    <section className={styles.base}>
      <div className={styles.origin}>
        <div className={styles.station}>
          <span>{currentStatus.train.origin.name}</span>
          <span className={styles.time}>
            ab {departureTime}
            {departureDelay > 0 && (
              <span className={styles.delay}>
                &nbsp;<sup>+{departureDelay}</sup>
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.meta}>
        <LineIndicator
          className={styles.lineIndicator}
          lineName={currentStatus.train.lineName}
          product={currentStatus.train.category}
          productName=""
        />

        <div>
          <TbRoute size={18} />
          <span>{Math.ceil(currentStatus.train.distance / 1000)} km</span>
        </div>

        <div>
          <MdOutlineToken size={18} />
          <span>{currentStatus.train.points}</span>
        </div>
      </div>

      <div className={styles.destination}>
        <div className={styles.station}>
          <span>{currentStatus.train.destination.name}</span>
          <span className={styles.time}>
            an {arrivalTime}
            {arrivalDelay > 0 && (
              <span className={styles.delay}>
                &nbsp;<sup>+{arrivalDelay}</sup>
              </span>
            )}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CurrentStatus;
