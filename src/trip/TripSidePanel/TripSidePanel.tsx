'use client';

import { useCheckIn } from '@/checkin/useCheckIn';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { TripDetails } from '@/trip/TripDetails/TripDetails';
import styles from './TripSidePanel.module.css';

// Only visible on larger breakpoints, smaller ones use TripBottomDrawer.
export const TripSidePanel = () => {
  const {
    state: { departure },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);

  return (
    <aside className={styles.base} data-via-open={departure ? '' : undefined} inert={!departure}>
      <div className={styles.panel}>{displayedDeparture && <TripDetails departure={displayedDeparture} />}</div>
    </aside>
  );
};
