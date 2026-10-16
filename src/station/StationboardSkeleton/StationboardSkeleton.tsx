import { Fragment } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { DepartureTripItemSkeleton } from '@/station/DepartureTripItemSkeleton/DepartureTripItemSkeleton';
import styles from '@/station/Stationboard/Stationboard.module.css';

const directionWidthsByGroup = [['18ch'], ['24ch', '14ch'], ['20ch'], ['12ch'], ['22ch', '16ch'], ['15ch']];

export const StationboardSkeleton = () => {
  return (
    <div className={styles.base}>
      <Skeleton height="2.5rem" radius="0.5rem" style={{ marginBottom: '1rem' }} width="100%" />

      <ul className={styles.departures}>
        {directionWidthsByGroup.map((directionWidths, groupIndex) => (
          <li className={styles.departureGroup} key={groupIndex}>
            <span className={styles.groupLabel}>
              <Skeleton text width="4ch" />
            </span>

            <div className={styles.groupItems}>
              {directionWidths.map((directionWidth, index) => (
                <Fragment key={index}>
                  <DepartureTripItemSkeleton directionWidth={directionWidth} />
                  <hr />
                </Fragment>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
