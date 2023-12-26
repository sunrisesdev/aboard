import { inter } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import dbCleanStationName from 'db-clean-station-name';
import { TbRouteOff } from 'react-icons/tb';
import Shimmer from '../Shimmer/Shimmer';
import { Time } from '../Time/Time';
import styles from './StopoverSelector.module.scss';
import { StopoverProps, StopoverSelectorProps } from './types';

export const StopoverSelector = ({
  onSelect,
  stopovers,
}: StopoverSelectorProps) => {
  return (
    <ul
      className={styles.base}
      style={{ ['--stop-count' as any]: stopovers.length }}
    >
      {stopovers.map((stopover, index) => (
        <li key={index}>
          <Stopover onClick={() => onSelect(stopover)} stopover={stopover} />
        </li>
      ))}
    </ul>
  );
};

const StopSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={clsx(styles.stopover, styles.isSkeleton)}>
      <div className={styles.name}>
        <Shimmer width={`${width}%`} />
      </div>

      <div className={styles.time}>
        <Shimmer width="2rem" />
      </div>
    </button>
  );
};

const Stopover = ({ onClick, stopover }: StopoverProps) => {
  const cleanName = dbCleanStationName(stopover.station.name).trim();

  const isCancelled = stopover.status === 'cancelled';

  const schedule = parseSchedule({
    actual: stopover.arrival.actual ?? stopover.departure.actual,
    planned: stopover.arrival.planned ?? stopover.departure.planned!,
  });

  return (
    <button
      aria-disabled={isCancelled}
      className={styles.stopover}
      onClick={onClick}
    >
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
            stroke="var(--crimson-11)"
            strokeWidth="2px"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div className={styles.name}>
        <span>{cleanName || stopover.station.name}</span>
      </div>

      {!isCancelled ? (
        <Time
          delayStyle="p+a"
          schedule={schedule}
          style={{ ['--strike-text-color' as any]: '#9E0A5B' }}
        />
      ) : (
        <aside className={clsx(styles.cancelledNote, inter.className)}>
          <TbRouteOff />
          <span>Halt entfällt</span>
        </aside>
      )}
    </button>
  );
};
