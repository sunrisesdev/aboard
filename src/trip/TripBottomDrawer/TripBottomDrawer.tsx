'use client';

import { Drawer } from '@base-ui/react/drawer';
import { CheckInBottomDrawer } from '@/checkin/CheckInBottomDrawer/CheckInBottomDrawer';
import { useCheckIn } from '@/checkin/useCheckIn';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TripDetails } from '@/trip/TripDetails/TripDetails';
import styles from './TripBottomDrawer.module.css';

export const TripBottomDrawer = () => {
  const {
    dispatch,
    state: { completedCheckIn, departure },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <BottomDrawer
      // Only the nested success drawer stays visible after checking in
      hidden={Boolean(completedCheckIn)}
      open={Boolean(departure) && !isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'reset' });
      }}
    >
      <Drawer.Title className={styles.title}>Fahrtziel auswählen</Drawer.Title>

      <BottomDrawer.Content>
        {displayedDeparture && <TripDetails departure={displayedDeparture} inDrawer />}
      </BottomDrawer.Content>

      <CheckInBottomDrawer />
    </BottomDrawer>
  );
};
