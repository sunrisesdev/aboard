import { useState } from 'react';
import { CheckInContext } from './CheckIn.context';
import OriginStep from './OriginStep/OriginStep';
import Panel from './Panel/Panel';
import { CheckInContextValue, CheckInStep } from './types';

const STEPS: CheckInStep[] = ['origin', 'trip', 'destination', 'final'];

const CheckIn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [step, setStep] = useState<CheckInStep>('origin');

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
    query,
    setIsOpen,
    setQuery,
    step,
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      <Panel>{step === 'origin' && <OriginStep />}</Panel>
    </CheckInContext.Provider>
  );
};

export default CheckIn;
