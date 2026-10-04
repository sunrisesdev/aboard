'use client';

import { Drawer } from '@base-ui/react/drawer';
import { CheckInBottomDrawer } from '@/checkin/CheckInBottomDrawer/CheckInBottomDrawer';
import { useCheckIn } from '@/checkin/useCheckIn';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { TripDetails } from '@/trip/TripDetails/TripDetails';
import styles from './TripBottomDrawer.module.css';

export const TripBottomDrawer = () => {
  const {
    dispatch,
    state: { departure },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <Drawer.Root
      open={Boolean(departure) && !isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'reset' });
      }}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.backdrop} />
        <Drawer.Viewport className={styles.viewport}>
          <Drawer.Popup className={styles.popup}>
            <Drawer.Content>
              {displayedDeparture && <TripDetails departure={displayedDeparture} inDrawer />}
            </Drawer.Content>

            <CheckInBottomDrawer />
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
