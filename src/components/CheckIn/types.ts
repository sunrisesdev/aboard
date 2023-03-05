import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';

export type CheckInContextValue = {
  checkIn: () => void;
  destination: Stop | undefined;
  error: string | undefined; // TODO: Temporary solution
  goBack: () => void;
  isOpen: boolean;
  message: string;
  origin: Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'> | undefined;
  query: string;
  setDestination: (value: Stop | undefined) => void;
  setIsOpen: (value: boolean) => void;
  setMessage: (value: string) => void;
  setOrigin: (
    value: Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'> | undefined
  ) => void;
  setQuery: (value: string) => void;
  setTravelType: (value: number) => void;
  setTrip: (value: HAFASTrip | undefined) => void;
  setVisibility: (value: number) => void;
  step: CheckInStep;
  travelType: number;
  trip: HAFASTrip | undefined;
  visibility: number;
};

export type CheckInStep = 'origin' | 'trip' | 'destination' | 'final';
