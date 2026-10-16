'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@/components/Button/Button';
import type { StatusResource, StopoverResource } from '@/lib/traewelling';
import { EditStatusForm } from '@/status/EditStatusForm/EditStatusForm';
import styles from './EditStatusModal.module.css';

export const EditStatusModal = ({
  destinationStopovers,
  onOpenChange,
  open,
  status,
}: {
  destinationStopovers: StopoverResource[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
  status: StatusResource;
}) => {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />

        <Dialog.Popup className={styles.popup}>
          <EditStatusForm.Provider
            destinationStopovers={destinationStopovers}
            onSuccess={() => onOpenChange(false)}
            status={status}
          >
            <div className={styles.body}>
              <Dialog.Title className={styles.title}>Status bearbeiten</Dialog.Title>

              <EditStatusForm />
            </div>

            <footer className={styles.footer}>
              <Dialog.Close render={<Button variant="secondary" />}>Abbrechen</Dialog.Close>
              <EditStatusForm.Submit>Speichern</EditStatusForm.Submit>
            </footer>
          </EditStatusForm.Provider>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
