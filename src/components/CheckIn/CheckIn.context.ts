import { createContext } from 'react';
import { CheckInContextValue } from './types';

export const CheckInContext = createContext<CheckInContextValue>({
  goBack: () => void 0,
  isOpen: false,
  query: '',
  setIsOpen: () => void 0,
  setQuery: () => void 0,
  step: 'origin',
});
