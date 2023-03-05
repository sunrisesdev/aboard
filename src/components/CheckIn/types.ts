import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Stop } from '@/traewelling-sdk/types';

export type CheckInContextValue = {
  destination: Stop | undefined;
  goBack: () => void;
  isOpen: boolean;
  origin: Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'> | undefined;
  query: string;
  setDestination: (value: Stop | undefined) => void;
  setIsOpen: (value: boolean) => void;
  setOrigin: (
    value: Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'> | undefined
  ) => void;
  setQuery: (value: string) => void;
  setTrip: (value: HAFASTrip | undefined) => void;
  step: CheckInStep;
  trip: HAFASTrip | undefined;
};

export type CheckInStep = 'origin' | 'trip' | 'destination' | 'final';
