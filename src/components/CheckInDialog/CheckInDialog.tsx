import { sourceSans3 } from '@/styles/fonts';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import classNames from 'classnames';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  MdAltRoute,
  MdArrowBack,
  MdArrowForward,
  MdCheck,
} from 'react-icons/md';
import Button from '../Button/Button';
import DestinationSelector from '../DestinationSelector/DestinationSelector';
import LineIndicator from '../LineIndicator/LineIndicator';
import StationSearch from '../StationSearch/StationSearch';
import StatusCreator from '../StatusCreator/StatusCreator';
import TripSelector from '../TripSelector/TripSelector';
import styles from './CheckInDialog.module.scss';
import { CheckInDialogProps, CheckInSummaryProps } from './types';

const checkIn = async (status: CheckinInput, session?: Session | null) => {
  const token = session?.user.accessToken;

  if (!token) {
    return;
  }

  const response = await fetch('/api/stations/checkin', {
    body: JSON.stringify(status),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    return;
  }

  return await response.json();
};

const steps = ['origin', 'trip', 'destination', 'status'];

const CheckInDialog = ({ isOpen, onIsOpenChange }: CheckInDialogProps) => {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [selectedStation, setSelectedStation] =
    useState<Pick<Station, 'name' | 'rilIdentifier'>>();
  const [selectedTrip, setSelectedTrip] = useState<HAFASTrip>();
  const [selectedDestination, setSelectedDestination] = useState<Stop>();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [travelType, setTravelType] = useState(0);

  const canContinue =
    (step === 0 && !!selectedStation) ||
    (step === 1 && !!selectedTrip) ||
    (step === 2 && !!selectedDestination);

  const handleCheckInClick = async () => {
    try {
      await checkIn(
        {
          arrival: selectedDestination!.arrival!,
          body: statusMessage,
          business: travelType,
          departure: selectedTrip!.when!,
          destination: selectedDestination!.evaIdentifier,
          ibnr: true,
          lineName: selectedTrip!.line.name,
          start: selectedTrip!.station.ibnr,
          tripId: selectedTrip!.tripId,
          visibility: 2, // TODO: Allow selection
        },
        session
      );

      setStep(0);

      if (selectedDestination) {
        setSelectedStation({
          name: selectedDestination.name,
          rilIdentifier: selectedDestination.rilIdentifier,
        });
      } else {
        setSelectedStation(undefined);
      }

      setSelectedDestination(undefined);
      setSelectedTrip(undefined);

      onIsOpenChange(false);
    } catch {
      // TODO: Do something
    }
  };

  const handleStationSelect = (
    station: Pick<Station, 'name' | 'rilIdentifier'>
  ) => {
    setSelectedStation(station);
    setSelectedTrip(undefined);
    setSelectedDestination(undefined);
  };

  const handleTripSelect = (trip: HAFASTrip) => {
    setSelectedTrip(trip);
    setSelectedDestination(undefined);
  };

  return (
    <Dialog.Root onOpenChange={onIsOpenChange} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content
          className={classNames(styles.base, sourceSans3.className)}
        >
          <Tabs.Root
            className={styles.tab}
            onValueChange={(value) => setStep(steps.indexOf(value))}
            value={steps[step]}
          >
            <Tabs.Content className={styles.tab} value="origin">
              <header className={styles.header}>
                <Dialog.Title>Check-In</Dialog.Title>
                <Dialog.Description>
                  An welcher Station steigst du ein?
                </Dialog.Description>
              </header>

              <StationSearch onStationSelect={handleStationSelect} />
            </Tabs.Content>

            <Tabs.Content className={styles.tab} value="trip">
              <header className={styles.header}>
                <Dialog.Title>Check-In</Dialog.Title>
                <Dialog.Description>
                  Welche Verbindung nutzt du?
                </Dialog.Description>
              </header>

              {!!selectedStation && step === 1 && (
                <TripSelector
                  onTripSelect={handleTripSelect}
                  stationName={selectedStation.name}
                />
              )}
            </Tabs.Content>

            <Tabs.Content className={styles.tab} value="destination">
              <header className={styles.header}>
                <Dialog.Title>Check-In</Dialog.Title>
                <Dialog.Description>
                  An welcher Station steigst du aus?
                </Dialog.Description>
              </header>

              {!!selectedTrip && step === 2 && (
                <DestinationSelector
                  hafasTripId={selectedTrip.tripId}
                  lineName={selectedTrip.line.name}
                  onDestinationSelect={setSelectedDestination}
                  plannedDeparture={selectedTrip.plannedWhen}
                  start={selectedTrip.station.id.toString()}
                />
              )}
            </Tabs.Content>

            <Tabs.Content className={styles.tab} value="status">
              <header className={styles.header}>
                <Dialog.Title>Check-In</Dialog.Title>
              </header>

              {step === 3 && (
                <StatusCreator
                  message={statusMessage}
                  onMessageChange={setStatusMessage}
                  onTravelTypeChange={setTravelType}
                  travelType={travelType}
                />
              )}
            </Tabs.Content>
          </Tabs.Root>

          <footer className={styles.footer}>
            <CheckInSummary
              selectedDeparture={selectedStation}
              selectedDestination={selectedDestination}
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
                  disabled={!canContinue}
                  onClick={() => setStep((step) => step + 1)}
                  variant="primary"
                >
                  <span>Weiter</span>
                  <MdArrowForward size={18} style={{ marginLeft: '0.25rem' }} />
                </Button>
              )}

              {step === 3 && (
                <Button onClick={handleCheckInClick} variant="primary">
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
  selectedDeparture,
  selectedDestination,
  selectedTrip,
}: CheckInSummaryProps) => {
  const deviatingFrom =
    selectedTrip && selectedTrip.station.name !== selectedDeparture?.name;
  const from = deviatingFrom
    ? selectedTrip.station.name
    : selectedDeparture?.name;

  if (!from) {
    return <div />;
  }

  const departure = selectedTrip && new Date(selectedTrip.plannedWhen);
  const arrival =
    (!!selectedDestination?.arrivalPlanned &&
      new Date(selectedDestination.arrivalPlanned)) ||
    undefined;

  const departureTime = departure?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const arrivalTime = arrival?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const arrivalDelay =
    arrival &&
    !!selectedDestination?.arrival &&
    Math.floor(
      Math.abs(
        arrival.getTime() - new Date(selectedDestination.arrival).getTime()
      ) /
        1000 /
        60
    );

  return (
    <div
      className={styles.summary}
      style={
        {
          '--color-product': `var(--color-${selectedTrip?.line.product}`,
        } as any
      }
    >
      <div className={styles.from}>
        <div className={styles.station}>
          <span>{from}</span>

          {selectedTrip && (
            <span className={styles.time}>
              ab {departureTime}
              {selectedTrip.delay > 0 && (
                <span className={styles.delay}>+{selectedTrip.delay / 60}</span>
              )}
            </span>
          )}
        </div>

        {deviatingFrom && (
          <div className={styles.details}>
            <div className={styles.deviatingStation}>
              <MdAltRoute
                size={20}
                style={{
                  color: 'var(--amber9)',
                }}
              />
              <em>Abweichende Abfahrt von einer Station in der Nähe</em>
            </div>
          </div>
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

      {selectedDestination && (
        <div className={styles.to}>
          <div className={styles.station}>
            <span>{selectedDestination.name}</span>

            {arrivalTime && (
              <span className={styles.time}>
                an {arrivalTime}
                {(arrivalDelay ?? 0) > 0 && (
                  <span className={styles.delay}>+{arrivalDelay}</span>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInDialog;
