'use client';

import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { useCurrentStatus } from '@/hooks/useCurrentStatus/useCurrentStatus';
import useUmami from '@/hooks/useUmami/useUmami';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import LiveCheckInSummary from '../LiveCheckInSummary/LiveCheckInSummary';
import LockBodyScroll from '../LockBodyScroll/LockBodyScroll';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
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

  const response = await fetch('/traewelling/stations/checkin', {
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
  const [departureTime, setDepartureTime] = useState<string>();
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

  const { trackEvent } = useUmami();

  const { mutate, status } = useCurrentStatus();

  const { journey } = useContext(LiveCheckInContext);

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
      setOrigin(undefined);
      setDepartureTime(undefined);
      setDestination(undefined);
      setTrip(undefined);

      setIsOpen(false);

      trackEvent('checkin', { type: 'click', status: 'success' });

      setTimeout(async () => await mutate(), 500);
    } catch (ex) {
      // TODO: Do something better
      trackEvent('checkin', { type: 'click', status: 'error' });
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
    departureTime,
    destination,
    error,
    goBack,
    isOpen,
    message,
    origin,
    query,
    reset: () => {
      setOrigin(undefined);
      setDepartureTime(undefined);
      setTrip(undefined);
      setDestination(undefined);

      setStep('origin');

      setIsOpen(false);
    },
    setDepartureTime,
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
      setDepartureTime(undefined);
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

  const theme = !status
    ? { accent: '#000', accentRGB: '0, 0, 0' as const }
    : getLineTheme(status.train.number, status.train.category);

  return (
    <CheckInContext.Provider value={contextValue}>
      <div className={styles.base}>
        <ThemeProvider theme={theme}>
          <Panel>
            {step === 'origin' && <OriginStep />}
            {step === 'trip' && <TripStep />}
            {step === 'destination' && <DestinationStep />}
            {step === 'final' && <FinalStep />}
            {isOpen && <LockBodyScroll />}

            {!isOpen && !!status && journey.length === 0 && (
              <Link className={styles.statusLink} href={`/status/${status.id}`}>
                <CurrentStatus />
              </Link>
            )}

            {!isOpen && journey.length > 0 && (
              <Link className={styles.statusLink} href="/live">
                <LiveCheckInSummary />
              </Link>
            )}
          </Panel>
        </ThemeProvider>
      </div>
    </CheckInContext.Provider>
  );
};

export default CheckIn;
