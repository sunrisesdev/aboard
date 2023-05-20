import { createContext } from 'react';
import { CheckInContextValue } from './types';

export const CheckInContext = createContext<CheckInContextValue>({
  checkIn: () => void 0,
  currentStatus: undefined,
  departureTime: undefined,
  destination: undefined,
  error: undefined,
  goBack: () => void 0,
  isOpen: false,
  message: '',
  origin: undefined,
  query: '',
  setDepartureTime: () => void 0,
  setDestination: () => void 0,
  setIsOpen: () => void 0,
  setMessage: () => void 0,
  setOrigin: () => void 0,
  setQuery: () => void 0,
  setTravelType: () => void 0,
  setTrip: () => void 0,
  setVisibility: () => void 0,
  step: 'origin',
  travelType: 0,
  trip: undefined,
  visibility: 0,
});
