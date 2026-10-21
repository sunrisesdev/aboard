'use client';

import { Drawer } from '@base-ui/react/drawer';
import { CheckInForm } from '@/checkin/CheckInForm/CheckInForm';
import { CheckInSuccess } from '@/checkin/CheckInSuccess/CheckInSuccess';
import { CheckInTripSummary } from '@/checkin/CheckInTripSummary/CheckInTripSummary';
import { useCheckIn } from '@/checkin/useCheckIn';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './CheckInBottomDrawer.module.css';

// Rendered as a nested drawer inside TripBottomDrawer, larger breakpoints use CheckInModal.
export const CheckInBottomDrawer = () => {
  const { dispatch, state } = useCheckIn();
  // Snapshots the whole state while open, so the closing drawer keeps showing either the form or the result
  const displayedState = useLastDefinedValue(state.destination ? state : undefined);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <BottomDrawer
      nested
      open={Boolean(state.destination) && !isWide}
      onOpenChange={(open) => {
        if (open) return;
        // After checking in, the trip is done with as well
        dispatch({ type: state.completedCheckIn ? 'reset' : 'clearDestination' });
      }}
    >
      {displayedState?.completedCheckIn ? (
        <>
          <Drawer.Title className={styles.title}>Eingecheckt</Drawer.Title>

          <BottomDrawer.Content>
            <CheckInSuccess completedCheckIn={displayedState.completedCheckIn} />
          </BottomDrawer.Content>

          <BottomDrawer.Footer>
            <CheckInSuccess.Actions completedCheckIn={displayedState.completedCheckIn} stretch />
          </BottomDrawer.Footer>
        </>
      ) : (
        <CheckInForm.Provider>
          <Drawer.Title className={styles.title}>Einchecken</Drawer.Title>

          <BottomDrawer.Content className={styles.content}>
            {displayedState?.departure && displayedState.destination && (
              <CheckInTripSummary departure={displayedState.departure} destination={displayedState.destination} />
            )}

            <CheckInForm inDrawer />
          </BottomDrawer.Content>

          <BottomDrawer.Footer>
            {/* <Drawer.Close render={<Button variant="secondary" />}>Abbrechen</Drawer.Close> */}
            <CheckInForm.Submit style={{ width: '100%' }}>Einchecken</CheckInForm.Submit>
          </BottomDrawer.Footer>
        </CheckInForm.Provider>
      )}
    </BottomDrawer>
  );
};
