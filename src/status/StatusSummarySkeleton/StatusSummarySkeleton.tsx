import { IconArrowRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { Card } from '@/components/Card/Card';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { TintedSurface } from '@/components/TintedSurface/TintedSurface';
import { TripLine } from '@/components/TripLine/TripLine';
import styles from '@/status/StatusSummary/StatusSummary.module.css';
import skeletonStyles from './StatusSummarySkeleton.module.css';

export const StatusSummarySkeleton = () => {
  return (
    <Card className={styles.base}>
      <header className={styles.header}>
        <Skeleton height="2.5rem" radius="9999rem" width="2.5rem" />
        <div>
          <div className={styles.author}>
            <Skeleton text width="18ch" />
          </div>
          <div className={styles.meta}>
            <Skeleton text width="14ch" />
          </div>
        </div>
      </header>

      <TintedSurface radius="1rem">
        <TintedSurface.Content className={clsx(styles.tripContent, skeletonStyles.tripContent)}>
          <div className={styles.tripHeader}>
            <Skeleton height="1.25rem" width="1.25rem" />
            <Skeleton height="1.25rem" width="2.5rem" />

            <span className={styles.tripFacts}>
              <Skeleton text width="12ch" />
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.time}>
              <Skeleton text width="4ch" />
            </span>
            <span className={clsx(styles.time, styles.arrival)}>
              <Skeleton text width="4ch" />
            </span>
          </div>

          <TripLine className={styles.tripLine} orientation="horizontal">
            <TripLine.StopIndicator />
            <div className={styles.segment}>
              <TripLine.RouteSegment />
            </div>
            <IconArrowRight aria-hidden className={styles.arrow} size={16} stroke={2} />
            <div className={styles.segment}>
              <TripLine.RouteSegment />
            </div>
            <TripLine.StopIndicator />
          </TripLine>

          <div className={styles.row}>
            <span className={styles.station}>
              <Skeleton text width="16ch" />
            </span>
            <span className={clsx(styles.station, styles.arrival)}>
              <Skeleton text width="12ch" />
            </span>
          </div>
        </TintedSurface.Content>
      </TintedSurface>

      <Skeleton className={styles.likeButton} radius="0.5rem" width="3.5rem" />
    </Card>
  );
};
