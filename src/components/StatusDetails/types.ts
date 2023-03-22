import { Stop } from '@/traewelling-sdk/types';

export type CurrentStopProps = {
  destination: Stop;
  stops: Stop[];
};

export type StatusDetailsProps = {
  id: string;
};
