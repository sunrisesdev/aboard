'use client';

import { Drawer } from '@base-ui/react/drawer';
import { CheckInForm } from '@/checkin/CheckInForm/CheckInForm';
import { useCheckIn } from '@/checkin/useCheckIn';
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
    <Drawer.Root
      open={Boolean(destination) && !isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'clearDestination' });
      }}
    >
      <Drawer.VirtualKeyboardProvider>
        <Drawer.Portal>
          <Drawer.Viewport className={styles.viewport}>
            <Drawer.Popup className={styles.popup}>
              <Drawer.Content className={styles.content}>
                <Drawer.Title className={styles.title}>Check-in</Drawer.Title>

                {displayedDeparture && displayedDestination && (
                  <CheckInTripSummary departure={displayedDeparture} destination={displayedDestination} />
                )}

                <CheckInForm />
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.VirtualKeyboardProvider>
    </Drawer.Root>
  );
};
