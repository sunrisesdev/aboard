import { Status, Stop } from '@/traewelling-sdk/types';

export type NextStopCountdownProps = {
  nextStop: Stop | undefined;
  setNextStop: (value: Stop | undefined) => void;
  stops: Stop[];
};

export type StatusDetailsProps = {
  status: Status;
  stops?: Stop[];
};
