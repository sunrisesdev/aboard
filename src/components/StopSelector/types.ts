import { Stop } from '@/traewelling-sdk/types';

export type StopProps = {
  arrivalAt: string | null;
  isCancelled: boolean;
  isDelayed: boolean;
  name: string;
  onClick?: () => void;
  plannedArrivalAt: string | null;
};

export type StopSelectorProps = {
  onSelect: (value: Stop) => void;
  stops: Stop[];
};
