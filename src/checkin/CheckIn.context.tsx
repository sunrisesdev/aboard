'use client';

import ky from 'ky';
import { createContext, type PropsWithChildren, useReducer } from 'react';
import useSWR from 'swr';
import type { DepartureResource, TripResource } from '@/lib/traewelling';
import { splitStopoversAtBoarding } from './splitStopoversAtBoarding';
import type { CheckInAction, CheckInContextValue, CheckInState } from './types';

const initialCheckInState: CheckInState = {};

function checkInReducer(state: CheckInState, action: CheckInAction): CheckInState {
  switch (action.type) {
    case 'selectDeparture': {
      return { departure: action.departure };
    }
    case 'selectDestination': {
      return { ...state, destination: action.destination };
    }
    case 'clearDestination': {
      return { ...state, completedCheckIn: undefined, destination: undefined };
    }
    // Keeps the departure and destination, so the check-in popup stays open to show the result
    case 'completeCheckIn': {
      return { ...state, completedCheckIn: action.completedCheckIn };
    }
    case 'reset': {
      return initialCheckInState;
    }
  }
}

function getTripUrl(departure: DepartureResource) {
  return `/api/trip/${encodeURIComponent(departure.tripId)}?lineName=${encodeURIComponent(departure.line.name ?? '')}`;
}

function useTrip(departure: DepartureResource | undefined) {
  const { data, error, isLoading } = useSWR(
    departure ? getTripUrl(departure) : null,
    (url: string) => ky.get(url).json<TripResource>(),
    { refreshInterval: 0, revalidateOnFocus: false },
  );

  if (!departure || !data) {
    return { error, isLoading };
  }

  const { boardingStopover, remainingStopovers } = splitStopoversAtBoarding(data.stopovers, {
    stationId: String(departure.station.id),
    time: departure.plannedWhen,
  });

  return { boardingStopover, error, isLoading, stopovers: remainingStopovers };
}

export const CheckInContext = createContext<CheckInContextValue | null>(null);

export const CheckInContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(checkInReducer, initialCheckInState);
  const trip = useTrip(state.departure);

  return <CheckInContext value={{ state, dispatch, trip }}>{children}</CheckInContext>;
};
