import { AboardStatus, AboardStopover, AboardTrip } from '@/types/aboard';

export type NextStopoverCountdownProps = {
  next: AboardStopover | undefined;
  setNext: (value: AboardStopover | undefined) => void;
  stopovers: AboardStopover[];
};

export type StatusDetailsProps = {
  destinationIndex?: number;
  originIndex?: number;
  status: AboardStatus;
  stopovers?: AboardStopover[];
  trip?: AboardTrip;
};
