import type { ActionDispatch } from 'react';
import type { DepartureResource, StopoverResource } from '@/lib/traewelling';

export type CheckInState = {
  departure?: DepartureResource;
  destination?: StopoverResource;
};

export type CheckInAction =
  | { type: 'selectDeparture'; departure: DepartureResource }
  | { type: 'selectDestination'; destination: StopoverResource }
  | { type: 'clearDestination' }
  | { type: 'reset' };

export type CheckInTrip = {
  boardingStopover?: StopoverResource;
  stopovers?: StopoverResource[];
  isLoading: boolean;
  error?: unknown;
};

export type CheckInContextValue = {
  state: CheckInState;
  dispatch: ActionDispatch<[action: CheckInAction]>;
  trip: CheckInTrip;
};
