import type { ActionDispatch } from 'react';
import type { DepartureResource, StatusResource, StopoverResource, TripResource } from '@/lib/traewelling';

export type CompletedCheckIn = {
  points: number;
  status: StatusResource;
};

export type CheckInState = {
  departure?: DepartureResource;
  destination?: StopoverResource;
  completedCheckIn?: CompletedCheckIn;
};

export type CheckInAction =
  | { type: 'selectDeparture'; departure: DepartureResource }
  | { type: 'selectDestination'; destination: StopoverResource }
  | { type: 'clearDestination' }
  | { type: 'completeCheckIn'; completedCheckIn: CompletedCheckIn }
  | { type: 'reset' };

export type CheckInTrip = {
  boardingStopover?: StopoverResource;
  stopovers?: StopoverResource[];
  operator?: TripResource['operator'];
  dataSource?: TripResource['dataSource'];
  isLoading: boolean;
  error?: unknown;
};

export type CheckInContextValue = {
  state: CheckInState;
  dispatch: ActionDispatch<[action: CheckInAction]>;
  trip: CheckInTrip;
};
