import { Stop } from '@/traewelling-sdk/types';

export type DestinationSelectorProps = {
  hafasTripId: string;
  lineName: string;
  onDestinationSelect: (destination: Stop) => void;
  plannedDeparture: string;
  start: string;
};

export type StationProps = {
  arrivalAt: string | null;
  isCancelled: boolean;
  isDelayed: boolean;
  name: string;
  onClick?: () => void;
  plannedArrivalAt: string | null;
};
