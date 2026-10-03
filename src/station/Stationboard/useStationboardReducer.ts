import { useReducer } from 'react';
import type { DepartureResource } from '@/lib/traewelling';

export type DepartureCursors = { now: string; prev: string; next: string };

type StationboardAction = {
  type: 'append' | 'prepend' | 'reset';
  cursors: DepartureCursors;
  departures: DepartureResource[];
};

type StationboardState = {
  departures: DepartureResource[];
  initialDepartures: DepartureResource[];
  nextCursor: string;
  previousCursor: string;
};

function createStationboardState({
  cursors,
  departures,
}: {
  cursors: DepartureCursors;
  departures: DepartureResource[];
}) {
  return {
    departures: uniqueByTrip(departures),
    initialDepartures: departures,
    nextCursor: cursors.next,
    previousCursor: cursors.prev,
  };
}

function stationboardReducer(state: StationboardState, action: StationboardAction): StationboardState {
  switch (action.type) {
    case 'append': {
      return {
        ...state,
        departures: uniqueByTrip([...state.departures, ...action.departures]),
        nextCursor: action.cursors.next,
      };
    }
    case 'prepend': {
      return {
        ...state,
        departures: uniqueByTrip([...state.departures, ...action.departures]),
        previousCursor: action.cursors.prev,
      };
    }
    case 'reset': {
      return createStationboardState(action);
    }
  }
}

// Later entries win, so freshly loaded departures replace stale ones.
function uniqueByTrip(departures: DepartureResource[]) {
  return [...new Map(departures.map((departure) => [departure.tripId, departure])).values()];
}

export function useStationboardReducer({
  initialCursors,
  initialDepartures,
}: {
  initialCursors: DepartureCursors;
  initialDepartures: DepartureResource[];
}) {
  const [state, dispatch] = useReducer(
    stationboardReducer,
    { cursors: initialCursors, departures: initialDepartures },
    createStationboardState,
  );

  // A new server render (e.g. after changing the filters) replaces everything loaded so far.
  if (state.initialDepartures !== initialDepartures) {
    dispatch({ type: 'reset', cursors: initialCursors, departures: initialDepartures });
  }

  return [state, dispatch] as const;
}
