'use client';

import type { PropsWithChildren } from 'react';
import { useCheckIn } from '@/checkin/useCheckIn';
import { TripBottomDrawer } from '@/trip/TripBottomDrawer/TripBottomDrawer';
import { TripSidePanel } from '@/trip/TripSidePanel/TripSidePanel';
import styles from './Stationboard.module.css';

export const StationboardPageContent = ({ children }: PropsWithChildren) => {
  const {
    state: { departure },
  } = useCheckIn();

  return (
    <div className={styles.base} data-via-trip-selected={!!departure || undefined}>
      <div className={styles.main}>{children}</div>

      <TripSidePanel />

      <TripBottomDrawer />
    </div>
  );
};
