import { Station, Stopover } from '@/traewelling-sdk/types';
import { AboardStatus, AboardTrip } from '@/types/aboard';

export type CheckInContextValue = {
  checkIn: () => void;
  currentStatus: AboardStatus | null | undefined;
  departureTime: string | undefined;
  destination: Stopover | undefined;
  error: string | undefined; // TODO: Temporary solution
  goBack: () => void;
  isOpen: boolean;
  message: string;
  origin: Station | undefined;
  query: string;
  setDepartureTime: (value: string | undefined) => void;
  setDestination: (value: Stopover | undefined) => void;
  setIsOpen: (value: boolean) => void;
  setMessage: (value: string) => void;
  setOrigin: (value: Station | undefined) => void;
  setQuery: (value: string) => void;
  setTravelType: (value: number) => void;
  setTrip: (value: AboardTrip | undefined) => void;
  setVisibility: (value: number) => void;
  step: CheckInStep;
  travelType: number;
  trip: AboardTrip | undefined;
  visibility: number;
};

export type CheckInStep = 'origin' | 'trip' | 'destination' | 'final';
