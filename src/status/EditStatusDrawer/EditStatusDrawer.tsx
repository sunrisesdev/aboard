'use client';

import { Drawer } from '@base-ui/react/drawer';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import type { StatusResource, StopoverResource } from '@/lib/traewelling';
import { EditStatusForm } from '@/status/EditStatusForm/EditStatusForm';
import styles from './EditStatusDrawer.module.css';

export const EditStatusDrawer = ({
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
    <BottomDrawer onOpenChange={onOpenChange} open={open}>
      <EditStatusForm.Provider
        destinationStopovers={destinationStopovers}
        onSuccess={() => onOpenChange(false)}
        status={status}
      >
        <Drawer.Title className={styles.title}>Status bearbeiten</Drawer.Title>

        <BottomDrawer.Content>
          <EditStatusForm inDrawer />
        </BottomDrawer.Content>

        <BottomDrawer.Footer>
          <EditStatusForm.Submit style={{ width: '100%' }}>Speichern</EditStatusForm.Submit>
        </BottomDrawer.Footer>
      </EditStatusForm.Provider>
    </BottomDrawer>
  );
};
