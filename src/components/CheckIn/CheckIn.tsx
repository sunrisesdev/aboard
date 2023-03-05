import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station } from '@/traewelling-sdk/types';
import { useState } from 'react';
import { CheckInContext } from './CheckIn.context';
import DestinationStep from './DestinationStep/DestinationStep';
import OriginStep from './OriginStep/OriginStep';
import Panel from './Panel/Panel';
import TripStep from './TripStep/TripStep';
import { CheckInContextValue, CheckInStep } from './types';

const STEPS: CheckInStep[] = ['origin', 'trip', 'destination', 'final'];

const CheckIn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] =
    useState<Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'>>();
  const [query, setQuery] = useState('');
  const [step, setStep] = useState<CheckInStep>('origin');
  const [trip, setTrip] = useState<HAFASTrip>();

  const goBack = () => {
    const index = STEPS.indexOf(step);

    if (index === 0) {
      setIsOpen(false);
      return;
    }

    setStep(STEPS[index - 1]);
  };

  const contextValue: CheckInContextValue = {
    goBack,
    isOpen,
    origin,
    query,
    setIsOpen,
    setOrigin: (value) => {
      setOrigin(value);
      setTrip(undefined);

      if (!!value) {
        setStep('trip');
      }
    },
    setQuery,
    setTrip: (value) => {
      setTrip(value);

      if (!!value) {
        setStep('destination');
      }
    },
    step,
    trip,
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      <Panel>
        {step === 'origin' && <OriginStep />}
        {step === 'trip' && <TripStep />}
        {step === 'destination' && <DestinationStep />}
      </Panel>
    </CheckInContext.Provider>
  );
};

export default CheckIn;
