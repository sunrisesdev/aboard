'use client';

import { Menu } from '@base-ui/react/menu';
import {
  IconArrowBarRight,
  IconArrowBarToRight,
  IconDotsVerticalFilled,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import { useState, useTransition } from 'react';
import { Button } from '@/components/Button/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { StatusResource, StopoverResource } from '@/lib/traewelling';
import { setStatusTimeToNowAction } from '@/status/actions';
import { DeleteStatusDialog } from '@/status/DeleteStatusDialog/DeleteStatusDialog';
import { EditStatusDrawer } from '@/status/EditStatusDrawer/EditStatusDrawer';
import { EditStatusModal } from '@/status/EditStatusModal/EditStatusModal';
import styles from './StatusActionsMenu.module.css';

export const StatusActionsMenu = ({
  destinationStopovers,
  status,
}: {
  destinationStopovers: StopoverResource[];
  status: StatusResource;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isWide = useMediaQuery('(width >= 64em)');

  const setTimeToNow = (stop: 'arrival' | 'departure') => {
    startTransition(async () => {
      const result = await setStatusTimeToNowAction(status.id, stop);

      if (!result.success) {
        window.alert(result.message);
      }
    });
  };

  return (
    <>
      <Menu.Root>
        <Menu.Trigger aria-label="Aktionen" disabled={isPending} render={<Button iconOnly variant="secondary" />}>
          <IconDotsVerticalFilled data-via-icon />
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner align="end" className={styles.positioner} sideOffset={4}>
            <Menu.Popup className={styles.popup}>
              <Menu.Item className={styles.item} onClick={() => setTimeToNow('departure')}>
                <IconArrowBarRight aria-hidden data-via-icon />
                Abfahrt jetzt
              </Menu.Item>
              <Menu.Item className={styles.item} onClick={() => setTimeToNow('arrival')}>
                <IconArrowBarToRight aria-hidden data-via-icon />
                Ankunft jetzt
              </Menu.Item>

              <Menu.Separator className={styles.separator} />

              <Menu.Item className={styles.item} onClick={() => setEditOpen(true)}>
                <IconPencil aria-hidden data-via-icon />
                Bearbeiten
              </Menu.Item>
              <Menu.Item className={clsx(styles.item, styles.isDestructive)} onClick={() => setDeleteDialogOpen(true)}>
                <IconTrash aria-hidden data-via-icon />
                Löschen
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <EditStatusModal
        destinationStopovers={destinationStopovers}
        onOpenChange={setEditOpen}
        open={editOpen && isWide}
        status={status}
      />
      <EditStatusDrawer
        destinationStopovers={destinationStopovers}
        onOpenChange={setEditOpen}
        open={editOpen && !isWide}
        status={status}
      />

      <DeleteStatusDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen} statusId={status.id} />
    </>
  );
};
