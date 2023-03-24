import { Status, Stop } from '@/traewelling-sdk/types';

export type CurrentStopProps = {
  stops: Stop[];
  withoutStationName?: boolean;
};

export type StatusDetailsProps = {
  status: Status;
};
