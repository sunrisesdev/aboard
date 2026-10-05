'use client';

import { Drawer } from '@base-ui/react/drawer';
import { CheckInForm } from '@/checkin/CheckInForm/CheckInForm';
import { useCheckIn } from '@/checkin/useCheckIn';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CheckInTripSummary } from '../CheckInTripSummary/CheckInTripSummary';
import styles from './CheckInBottomDrawer.module.css';

// Rendered as a nested drawer inside TripBottomDrawer, larger breakpoints use CheckInModal.
export const CheckInBottomDrawer = () => {
  const {
    dispatch,
    state: { departure, destination },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);
  const displayedDestination = useLastDefinedValue(destination);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <BottomDrawer
      nested
      open={Boolean(destination) && !isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'clearDestination' });
      }}
      snapPoints={[0.6, 1]}
    >
      <CheckInForm.Provider>
        <Drawer.Title className={styles.title}>Einchecken</Drawer.Title>

        <BottomDrawer.Content className={styles.content}>
          {displayedDeparture && displayedDestination && (
            <CheckInTripSummary departure={displayedDeparture} destination={displayedDestination} />
          )}

          <CheckInForm inDrawer />
        </BottomDrawer.Content>

        <BottomDrawer.Footer>
          {/* <Drawer.Close render={<Button variant="secondary" />}>Abbrechen</Drawer.Close> */}
          <CheckInForm.Submit style={{ width: '100%' }}>Einchecken</CheckInForm.Submit>
        </BottomDrawer.Footer>
      </CheckInForm.Provider>
    </BottomDrawer>
  );
};
