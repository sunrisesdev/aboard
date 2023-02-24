import { sourceSans3 } from '@/styles/fonts';
import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station } from '@/traewelling-sdk/types';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { useState } from 'react';
import {
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdDirections,
} from 'react-icons/md';
import Button from '../Button/Button';
import LineIndicator from '../LineIndicator/LineIndicator';
import StationSearch from '../StationSearch/StationSearch';
import TripSelector from '../TripSelector/TripSelector';
import styles from './CheckInDialog.module.scss';
import { CheckInDialogProps, CheckInSummaryProps } from './types';

const steps = ['origin', 'trip', 'destination', 'status'];

const CheckInDialog = ({ isOpen, onIsOpenChange }: CheckInDialogProps) => {
  const [step, setStep] = useState(0);
  const [selectedStation, setSelectedStation] =
    useState<Pick<Station, 'name' | 'rilIdentifier'>>();
  const [selectedTrip, setSelectedTrip] = useState<HAFASTrip>();

  const handleStationSelect = (
    station: Pick<Station, 'name' | 'rilIdentifier'>
  ) => {
    setSelectedStation(station);
    setSelectedTrip(undefined);
  };

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
              <StationSearch onStationSelect={handleStationSelect} />
            </Tabs.Content>

            <Tabs.Content className={styles.tab} value="trip">
              {!!selectedStation && step === 1 && (
                <TripSelector
                  onTripSelect={setSelectedTrip}
                  stationName={selectedStation.name}
                />
              )}
            </Tabs.Content>
          </Tabs.Root>

          <footer className={styles.footer}>
            <CheckInSummary
              selectedStation={selectedStation}
              selectedTrip={selectedTrip}
            />

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

const CheckInSummary = ({
  selectedStation,
  selectedTrip,
}: CheckInSummaryProps) => {
  const deviatingFrom =
    selectedTrip && selectedTrip.station.name !== selectedStation?.name;
  const from = deviatingFrom
    ? selectedTrip.station.name
    : selectedStation?.name;

  if (!from) {
    return <div />;
  }

  const departureTime =
    selectedTrip &&
    new Date(selectedTrip.plannedWhen).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={styles.summary}>
      <div className={styles.stop}>
        <span>{from}</span>

        {deviatingFrom && (
          <MdDirections
            size={20}
            style={{
              color: 'var(--amber9)',
            }}
          />
        )}

        {selectedTrip && (
          <span className={styles.time}>
            {departureTime}
            {selectedTrip.delay > 0 && (
              <span className={styles.delay}>+{selectedTrip.delay / 60}</span>
            )}
          </span>
        )}
      </div>

      {selectedTrip && (
        <div className={styles.via}>
          <LineIndicator
            className={styles.lineIndicator}
            lineName={selectedTrip.line.name}
            product={selectedTrip.line.product}
            productName={selectedTrip.line.productName}
          />

          <div className={styles.direction}>
            {selectedTrip.direction ?? selectedTrip.destination.name}
          </div>
        </div>
      )}

      {/* <div className={styles.stop}>
        <span>{from}</span>
        <span className={styles.time}>15:22</span>
      </div> */}
    </div>
  );
};

export default CheckInDialog;
