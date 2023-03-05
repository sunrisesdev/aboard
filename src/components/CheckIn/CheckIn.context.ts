import { createContext } from 'react';
import { CheckInContextValue } from './types';

export const CheckInContext = createContext<CheckInContextValue>({
  goBack: () => void 0,
  isOpen: false,
  origin: undefined,
  query: '',
  setIsOpen: () => void 0,
  setOrigin: () => void 0,
  setQuery: () => void 0,
  setTrip: () => void 0,
  step: 'origin',
  trip: undefined,
});
