import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Stop } from '@/traewelling-sdk/types';

export type LiveCheckIn = {
  checkedIn: boolean;
  destination: Stop;
  trip: HAFASTrip;
};

export type LiveCheckInContextValue = {
  addCheckIn: (trip: HAFASTrip, destination: Stop) => void;
  currentCheckInIndex: number;
  journey: LiveCheckIn[];
  nextCheckIn?: LiveCheckIn;
  remainingCheckIns: LiveCheckIn[];
  untilNextCheckIn?: number;
};
