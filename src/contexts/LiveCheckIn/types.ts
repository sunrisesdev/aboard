import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Stop } from '@/traewelling-sdk/types';

export type LiveCheckIn = {
  destination: Stop;
  trip: HAFASTrip;
};

export type LiveCheckInContextValue = {
  addCheckIn: (trip: HAFASTrip, destination: Stop) => void;
  journey: LiveCheckIn[];
};
