'use client';

import useAccentColor from '@/hooks/useAccentColor/useAccentColor';
import { useStatus } from '@/hooks/useStatus/useStatus';
import { parseSchedule } from '@/utils/parseSchedule';
import { MdOutlineToken } from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import LineIndicator from '../LineIndicator/LineIndicator';
import styles from './StatusDetails.module.scss';
import { StatusDetailsProps } from './types';

const StatusDetails = ({ id }: StatusDetailsProps) => {
  const { status } = useStatus(id);

  useAccentColor(`var(--color-${status?.train.category})`);

  if (status === undefined) {
    return <div>Lade...</div>;
  }

  if (status === null) {
    return <div>Status nicht gefunden</div>;
  }

  const arrivalSchedule = parseSchedule({
    actual: status.train.destination.arrival,
    planned: status.train.destination.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: status.train.origin.departure,
    planned: status.train.origin.departurePlanned!,
  });

  return (
    <section className={styles.base}>
      <div className={styles.origin}>
        <div className={styles.station}>
          <span>{status.train.origin.name}</span>
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
          lineName={status.train.lineName}
          product={status.train.category}
          productName=""
        />

        <div>
          <TbRoute size={18} />
          <span>{Math.ceil(status.train.distance / 1000)} km</span>
        </div>

        <div>
          <MdOutlineToken size={18} />
          <span>{status.train.points}</span>
        </div>
      </div>

      <div className={styles.destination}>
        <div className={styles.station}>
          <span>{status.train.destination.name}</span>
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

export default StatusDetails;
