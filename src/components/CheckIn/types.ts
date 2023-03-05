export type CheckInContextValue = {
  goBack: () => void;
  isOpen: boolean;
  query: string;
  setIsOpen: (value: boolean) => void;
  setQuery: (value: string) => void;
  step: CheckInStep;
};

export type CheckInStep = 'origin' | 'trip' | 'destination' | 'final';
