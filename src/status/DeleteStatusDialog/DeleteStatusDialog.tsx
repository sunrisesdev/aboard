'use client';

import { AlertDialog } from '@base-ui/react/alert-dialog';
import { useTransition } from 'react';
import { Button } from '@/components/Button/Button';
import { deleteStatusAction } from '@/status/actions';
import styles from './DeleteStatusDialog.module.css';

export const DeleteStatusDialog = ({
  onOpenChange,
  open,
  statusId,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  statusId: number;
}) => {
  const [isPending, startTransition] = useTransition();

  const deleteStatus = () => {
    startTransition(async () => {
      const result = await deleteStatusAction(statusId);

      if (!result.success) {
        window.alert(result.message);
      }
    });
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={(nextOpen) => !isPending && onOpenChange(nextOpen)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className={styles.backdrop} />

        <AlertDialog.Popup className={styles.popup}>
          <AlertDialog.Title className={styles.title}>Möchtest du diesen Status löschen?</AlertDialog.Title>
          <AlertDialog.Description className={styles.description}>
            Das lässt sich nicht rückgängig machen.
          </AlertDialog.Description>

          <div className={styles.actions}>
            <AlertDialog.Close disabled={isPending} render={<Button variant="secondary" />}>
              Abbrechen
            </AlertDialog.Close>
            <Button disabled={isPending} onClick={deleteStatus} variant="danger">
              {isPending ? 'Löscht…' : 'Löschen'}
            </Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
