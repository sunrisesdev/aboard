'use client';

import { Dialog } from '@base-ui/react/dialog';
import { CheckInForm } from '@/checkin/CheckInForm/CheckInForm';
import { useCheckIn } from '@/checkin/useCheckIn';
import { Button } from '@/components/Button/Button';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CheckInTripSummary } from '../CheckInTripSummary/CheckInTripSummary';
import styles from './CheckInModal.module.css';

// Only used on larger breakpoints, smaller ones use CheckInBottomDrawer.
export const CheckInModal = () => {
  const {
    dispatch,
    state: { departure, destination },
  } = useCheckIn();
  const displayedDeparture = useLastDefinedValue(departure);
  const displayedDestination = useLastDefinedValue(destination);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <Dialog.Root
      open={Boolean(destination) && isWide}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: 'clearDestination' });
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Popup className={styles.popup}>
          <CheckInForm.Provider>
            <div className={styles.body}>
              <Dialog.Title className={styles.title}>Check-in</Dialog.Title>

              <div className={styles.content}>
                <aside>
                  {displayedDeparture && displayedDestination && (
                    <CheckInTripSummary departure={displayedDeparture} destination={displayedDestination} />
                  )}
                </aside>

                <CheckInForm />
              </div>
            </div>

            <footer className={styles.footer}>
              <Dialog.Close render={<Button variant="secondary" />}>Abbrechen</Dialog.Close>
              <CheckInForm.Submit>Einchecken</CheckInForm.Submit>
            </footer>
          </CheckInForm.Provider>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
