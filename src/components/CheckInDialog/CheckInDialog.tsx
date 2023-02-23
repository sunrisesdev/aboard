import { Station } from '@/traewelling-sdk/types';
import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { MdArrowForward } from 'react-icons/md';
import Button from '../Button/Button';
import StationSearch from '../StationSearch/StationSearch';
import styles from './CheckInDialog.module.scss';
import { CheckInDialogProps } from './types';

const CheckInDialog = ({ isOpen, onIsOpenChange }: CheckInDialogProps) => {
  const [selectedStation, setSelectedStation] =
    useState<Pick<Station, 'name' | 'rilIdentifier'>>();

  const stationName = `${selectedStation?.name}${
    !selectedStation?.rilIdentifier ? '' : ` (${selectedStation.rilIdentifier})`
  }`;

  return (
    <Dialog.Root onOpenChange={onIsOpenChange} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.base}>
          <header className={styles.header}>
            <Dialog.Title>Check-In</Dialog.Title>
            <Dialog.Description>
              Wähle deine Abfahrtshaltestelle aus
            </Dialog.Description>
          </header>

          <StationSearch onStationSelect={setSelectedStation} />

          <footer className={styles.footer}>
            {selectedStation && (
              <div className={styles.station}>
                <label>Ausgewählte Station</label>
                <div>{stationName}</div>
              </div>
            )}

            <nav className={styles.nav}>
              <Button disabled={!selectedStation} variant="primary">
                <span>Weiter</span>
                <MdArrowForward size={18} style={{ marginLeft: '0.25rem' }} />
              </Button>
            </nav>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CheckInDialog;
