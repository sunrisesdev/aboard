import { inter } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { TbRouteOff } from 'react-icons/tb';
import Shimmer from '../Shimmer/Shimmer';
import styles from './StopSelector.module.scss';
import { StopProps, StopSelectorProps } from './types';

export const StopSelector = ({ onSelect, stops }: StopSelectorProps) => {
  return (
    <ul
      className={styles.base}
      style={{ ['--stop-count' as any]: stops.length }}
    >
      {stops.map((stop, index) => (
        <li key={index}>
          <Stop
            arrivalAt={stop.arrival ?? stop.departure}
            isCancelled={stop.cancelled}
            isDelayed={
              stop.isArrivalDelayed ||
              (!stop.arrival && stop.isDepartureDelayed)
            }
            name={stop.name}
            onClick={() => onSelect(stop)}
            plannedArrivalAt={stop.arrivalPlanned ?? stop.departurePlanned}
          />
        </li>
      ))}
    </ul>
  );
};

const StopSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={clsx(styles.stop, styles.isSkeleton)}>
      <div className={styles.name}>
        <Shimmer width={`${width}%`} />
      </div>

      <div className={styles.time}>
        <Shimmer width="2rem" />
      </div>
    </button>
  );
};

const Stop = ({
  arrivalAt,
  isCancelled,
  isDelayed,
  name,
  onClick,
  plannedArrivalAt,
}: StopProps) => {
  const schedule = parseSchedule({
    actual: arrivalAt,
    planned: plannedArrivalAt!,
  });

  return (
    <button className={styles.stop} disabled={isCancelled} onClick={onClick}>
      {isCancelled && (
        <svg
          className={styles.partial}
          height="100%"
          version="1.1"
          width={42}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            strokeDasharray="0.1 4"
            x1={21}
            y1={0}
            x2={21}
            y2="100%"
            stroke="var(--crimson11)"
            strokeWidth="2px"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className={styles.name}>
        <span>{name}</span>
        {/* <br />
        <span
          style={{ fontSize: '0.875rem', fontWeight: '500', opacity: '0.75' }}
        >
          Heidelberg
        </span> */}
      </div>

      {!isCancelled ? (
        <div className={styles.time}>
          <div className={clsx({ [styles.isDelayed]: isDelayed })}>
            {schedule.planned}
          </div>
          {isDelayed && <div>{schedule.actual}</div>}
        </div>
      ) : (
        <aside className={clsx(styles.cancelledNote, inter.className)}>
          <TbRouteOff />
          <span>Halt entfällt</span>
        </aside>
      )}
    </button>
  );
};
