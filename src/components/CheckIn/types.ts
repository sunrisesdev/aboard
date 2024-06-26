import { Station, Stop } from '@/traewelling-sdk/types';
import { AboardStatus, AboardTrip } from '@/types/aboard';

export type CheckInContextValue = {
  checkIn: () => void;
  currentStatus: AboardStatus | null | undefined;
  departureTime: string | undefined;
  destination: Stop | undefined;
  error: string | undefined; // TODO: Temporary solution
  goBack: () => void;
  isOpen: boolean;
  message: string;
  origin: Pick<Station, 'id' | 'ibnr' | 'name' | 'rilIdentifier'> | undefined;
  query: string;
  setDepartureTime: (value: string | undefined) => void;
  setDestination: (value: Stop | undefined) => void;
  setIsOpen: (value: boolean) => void;
  setMessage: (value: string) => void;
  setOrigin: (
    value: Pick<Station, 'id' | 'ibnr' | 'name' | 'rilIdentifier'> | undefined
  ) => void;
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
