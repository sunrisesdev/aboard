import { sourceSans3 } from '@/styles/fonts';
import { Station } from '@/traewelling-sdk/types';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { useState } from 'react';
import { MdArrowBack, MdArrowForward, MdCheck } from 'react-icons/md';
import Button from '../Button/Button';
import StationSearch from '../StationSearch/StationSearch';
import TripSelector from '../TripSelector/TripSelector';
import styles from './CheckInDialog.module.scss';
import { CheckInDialogProps } from './types';

const steps = ['origin', 'trip', 'destination', 'status'];

const CheckInDialog = ({ isOpen, onIsOpenChange }: CheckInDialogProps) => {
  const [step, setStep] = useState(0);
  const [selectedStation, setSelectedStation] =
    useState<Pick<Station, 'name' | 'rilIdentifier'>>();

  const stationName = `${selectedStation?.name}${
    !selectedStation?.rilIdentifier ? '' : ` (${selectedStation.rilIdentifier})`
  }`;

  return (
    <Dialog.Root onOpenChange={onIsOpenChange} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content
          className={classNames(styles.base, sourceSans3.className)}
        >
          <header className={styles.header}>
            <Dialog.Title>Check-In</Dialog.Title>
            {/* <Dialog.Description>
              An welcher Station fährst du los?
            </Dialog.Description> */}
          </header>

          <Tabs.Root
            className={styles.tab}
            onValueChange={(value) => setStep(steps.indexOf(value))}
            value={steps[step]}
          >
            <Tabs.Content className={styles.tab} value="origin">
              <StationSearch onStationSelect={setSelectedStation} />
            </Tabs.Content>

            <Tabs.Content className={styles.tab} value="trip">
              {!!selectedStation && step === 1 && (
                <TripSelector stationName={selectedStation.name} />
              )}
            </Tabs.Content>
          </Tabs.Root>

          <footer className={styles.footer}>
            {selectedStation && (
              <div className={styles.station}>
                <label>Ausgewählte Station</label>
                <div>{stationName}</div>
              </div>
            )}

            <nav className={styles.nav}>
              {step > 0 && (
                <Button onClick={() => setStep((step) => step - 1)}>
                  <MdArrowBack size={18} style={{ marginRight: '0.25rem' }} />
                  <span>Zurück</span>
                </Button>
              )}

              {step < 3 && (
                <Button
                  disabled={!selectedStation}
                  onClick={() => setStep((step) => step + 1)}
                  variant="primary"
                >
                  <span>Weiter</span>
                  <MdArrowForward size={18} style={{ marginLeft: '0.25rem' }} />
                </Button>
              )}

              {step === 3 && (
                <Button disabled={!selectedStation} variant="primary">
                  <span>Einchecken</span>
                  <MdCheck size={18} style={{ marginLeft: '0.25rem' }} />
                </Button>
              )}
            </nav>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CheckInDialog;
