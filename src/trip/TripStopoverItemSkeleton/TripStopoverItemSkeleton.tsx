import type { CSSProperties } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { TripLine } from '@/components/TripLine/TripLine';
import stopoverStyles from '@/trip/TripStopoverItem/TripStopoverItem.module.css';
import styles from './TripStopoverItemSkeleton.module.css';

export const TripStopoverItemSkeleton = ({
  last = false,
  stationWidth,
}: {
  last?: boolean;
  stationWidth: CSSProperties['width'];
}) => {
  return (
    <div className={styles.base}>
      <TripLine className={stopoverStyles.tripLine}>
        <TripLine.RouteSegment />
        <TripLine.StopIndicator />
        <TripLine.RouteSegment style={{ visibility: last ? 'hidden' : 'visible' }} />
      </TripLine>

      <div className={stopoverStyles.content}>
        <span>
          <Skeleton text width={stationWidth} />
        </span>

        {/* The time stacks its lines as flex items, the extra span keeps the line height */}
        <span className={stopoverStyles.time}>
          <span>
            <Skeleton text width="4ch" />
          </span>
        </span>
      </div>
    </div>
  );
};
