'use client';

import { Dialog } from '@base-ui/react/dialog';
import { CheckInForm } from '@/checkin/CheckInForm/CheckInForm';
import { CheckInSuccess } from '@/checkin/CheckInSuccess/CheckInSuccess';
import { CheckInTripSummary } from '@/checkin/CheckInTripSummary/CheckInTripSummary';
import { useCheckIn } from '@/checkin/useCheckIn';
import { Button } from '@/components/Button/Button';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import styles from './CheckInModal.module.css';

// Only used on larger breakpoints, smaller ones use CheckInBottomDrawer.
export const CheckInModal = () => {
  const { dispatch, state } = useCheckIn();
  // Snapshots the whole state while open, so the closing modal keeps showing either the form or the result
  const displayedState = useLastDefinedValue(state.destination ? state : undefined);
  const isWide = useMediaQuery('(width >= 64em)');

  return (
    <Dialog.Root
      open={Boolean(state.destination) && isWide}
      onOpenChange={(open) => {
        if (open) return;
        // After checking in, the trip is done with as well
        dispatch({ type: state.completedCheckIn ? 'reset' : 'clearDestination' });
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Popup className={styles.popup} data-via-completed={displayedState?.completedCheckIn ? '' : undefined}>
          {displayedState?.completedCheckIn ? (
            <>
              <div className={styles.body}>
                <Dialog.Title className={styles.title}>Eingecheckt</Dialog.Title>
                <CheckInSuccess completedCheckIn={displayedState.completedCheckIn} />
              </div>

              <footer className={styles.footer}>
                <Dialog.Close render={<Button variant="secondary" />}>Schließen</Dialog.Close>
                <div className={styles.controls}>
                  <CheckInSuccess.Actions completedCheckIn={displayedState.completedCheckIn} />
                </div>
              </footer>
            </>
          ) : (
            <CheckInForm.Provider>
              <div className={styles.body}>
                <Dialog.Title className={styles.title}>Check-in</Dialog.Title>

                <div className={styles.content}>
                  <aside>
                    {displayedState?.departure && displayedState.destination && (
                      <CheckInTripSummary
                        departure={displayedState.departure}
                        destination={displayedState.destination}
                      />
                    )}
                  </aside>

                  <CheckInForm />
                </div>
              </div>

              <footer className={styles.footer}>
                <div className={styles.controls}>
                  <Dialog.Close render={<Button style={{ minWidth: '7.5rem' }} variant="secondary" />}>
                    Abbrechen
                  </Dialog.Close>
                  <CheckInForm.Submit style={{ minWidth: '7.5rem' }}>Einchecken</CheckInForm.Submit>
                </div>
              </footer>
            </CheckInForm.Provider>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
