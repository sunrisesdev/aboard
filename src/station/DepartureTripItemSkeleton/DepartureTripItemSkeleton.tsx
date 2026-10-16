import type { CSSProperties } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import departureStyles from '@/station/DepartureTripItem/DepartureTripItem.module.css';
import styles from './DepartureTripItemSkeleton.module.css';

export const DepartureTripItemSkeleton = ({ directionWidth }: { directionWidth: CSSProperties['width'] }) => {
  return (
    <div className={styles.base}>
      <div className={departureStyles.topLine}>
        <Skeleton height="1.25rem" width="2.5rem" />

        <span className={departureStyles.direction}>
          <Skeleton text width={directionWidth} />
        </span>

        <span className={departureStyles.delay}>
          <Skeleton text width="8ch" />
        </span>
      </div>

      <div
        className={departureStyles.statusLine}
        style={{ '--via-line-bg': 'var(--via-fg-tertiary)' } as CSSProperties}
      >
        <Skeleton height="1.25rem" width="1.25rem" />

        <span>
          <Skeleton text width="12ch" />
        </span>
      </div>
    </div>
  );
};
