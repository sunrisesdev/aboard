import { useCurrentStatus } from '@/hooks/useCurrentStatus/useCurrentStatus';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { CheckInContext } from './CheckIn.context';
import styles from './CheckIn.module.scss';
import CurrentStatus from './CurrentStatus/CurrentStatus';
import DestinationStep from './DestinationStep/DestinationStep';
import FinalStep from './FinalStep/FinalStep';
import OriginStep from './OriginStep/OriginStep';
import Panel from './Panel/Panel';
import TripStep from './TripStep/TripStep';
import { CheckInContextValue, CheckInStep } from './types';

const STEPS: CheckInStep[] = ['origin', 'trip', 'destination', 'final'];

const post = async (status: CheckinInput, session?: Session | null) => {
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
    throw response;
  }

  return await response.json();
};

const CheckIn = () => {
  const { data: session } = useSession();
  const [destination, setDestination] = useState<Stop>();
  const [error, setError] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [origin, setOrigin] =
    useState<Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'>>();
  const [query, setQuery] = useState('');
  const [step, setStep] = useState<CheckInStep>('origin');
  const [travelType, setTravelType] = useState(0);
  const [trip, setTrip] = useState<HAFASTrip>();
  const [visibility, setVisibility] = useState(0);

  const { mutate, status } = useCurrentStatus();

  const checkIn = async () => {
    try {
      await post(
        {
          arrival: destination!.arrivalPlanned!,
          body: message,
          business: travelType,
          departure: trip!.plannedWhen!,
          destination: destination!.evaIdentifier,
          ibnr: true,
          lineName: trip!.line.name,
          start: trip!.station.ibnr,
          tripId: trip!.tripId,
          visibility: visibility,
        },
        session
      );

      setStep('origin');

      if (destination) {
        setOrigin({
          ibnr: destination.evaIdentifier,
          name: destination.name,
          rilIdentifier: destination.rilIdentifier,
        });
      } else {
        setOrigin(undefined);
      }

      setDestination(undefined);
      setTrip(undefined);

      setIsOpen(false);

      setTimeout(async () => await mutate(), 500);
    } catch (ex) {
      // TODO: Do something better
      setError(JSON.stringify(ex, null, 2));
    }
  };

  const goBack = () => {
    const index = STEPS.indexOf(step);

    if (index === 0) {
      setIsOpen(false);
      return;
    }

    setStep(STEPS[index - 1]);
  };

  const contextValue: CheckInContextValue = {
    checkIn,
    currentStatus: status,
    destination,
    error,
    goBack,
    isOpen,
    message,
    origin,
    query,
    setDestination: (value) => {
      setDestination(value);

      if (!!value) {
        setStep('final');
      }
    },
    setIsOpen,
    setMessage,
    setOrigin: (value) => {
      setOrigin(value);
      setTrip(undefined);
      setDestination(undefined);

      if (!!value) {
        setStep('trip');
      }
    },
    setQuery,
    setTravelType,
    setTrip: (value) => {
      setTrip(value);
      setDestination(undefined);

      if (!!value) {
        setStep('destination');
      }
    },
    setVisibility,
    step,
    travelType,
    trip,
    visibility,
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      <div
        className={styles.base}
        style={{
          ['--current-status-color' as any]: `var(--color-${status?.train.category})`,
        }}
      >
        <Panel>
          {step === 'origin' && <OriginStep />}
          {step === 'trip' && <TripStep />}
          {step === 'destination' && <DestinationStep />}
          {step === 'final' && <FinalStep />}

          {!isOpen && !!status && <CurrentStatus />}
        </Panel>
      </div>
    </CheckInContext.Provider>
  );
};

export default CheckIn;
