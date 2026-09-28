import { useReducer } from 'react';
import { motisModeToTravelType } from '@/helpers/motisModeToTravelType';
import type { DepartureResource, TravelType } from '@/lib/traewelling';

export type DepartureCursors = { now: string; prev: string; next: string };

type StationboardAction =
  | {
      type: 'append' | 'prepend';
      cursors: DepartureCursors;
      departures: DepartureResource[];
      requestedTime: string;
    }
  | {
      type: 'replace';
      cursors: DepartureCursors;
      departures: DepartureResource[];
      requestedTime: string | undefined;
      travelType: TravelType | undefined;
    };

type StationboardState = {
  anchor: string;
  departures: DepartureResource[];
  knownTravelTypes: TravelType[];
  nextCursor: string;
  previousCursor: string;
  requestedTime: string | undefined;
  travelType: TravelType | undefined;
};

function addTravelTypes(current: TravelType[], departures: DepartureResource[]) {
  const types = new Set(current);

  for (const departure of departures) {
    const type = motisModeToTravelType(departure.line.mode);
    if (type) types.add(type);
  }

  return types.size === current.length ? current : [...types];
}

function stationboardReducer(state: StationboardState, action: StationboardAction) {
  const knownTravelTypes = addTravelTypes(state.knownTravelTypes, action.departures);

  switch (action.type) {
    case 'append': {
      return {
        ...state,
        anchor: action.requestedTime,
        departures: uniqueByTrip([...state.departures, ...action.departures]),
        knownTravelTypes,
        nextCursor: action.cursors.next,
        requestedTime: action.requestedTime,
      };
    }
    case 'prepend': {
      return {
        ...state,
        anchor: action.requestedTime,
        departures: uniqueByTrip([...state.departures, ...action.departures]),
        knownTravelTypes,
        previousCursor: action.cursors.prev,
        requestedTime: action.requestedTime,
      };
    }
    case 'replace': {
      return {
        anchor: action.requestedTime ?? action.cursors.now,
        departures: uniqueByTrip(action.departures),
        knownTravelTypes,
        nextCursor: action.cursors.next,
        previousCursor: action.cursors.prev,
        requestedTime: action.requestedTime,
        travelType: action.travelType,
      };
    }
  }
}

// Later entries win, so freshly loaded departures replace stale ones.
function uniqueByTrip(departures: DepartureResource[]) {
  return [...new Map(departures.map((departure) => [departure.tripId, departure])).values()];
}

export function useStationboardReducer({
  availableTravelTypes,
  initialCursors,
  initialDepartures,
  initialRequestedTime,
  initialTravelType,
}: {
  availableTravelTypes: TravelType[];
  initialCursors: DepartureCursors;
  initialDepartures: DepartureResource[];
  initialRequestedTime: string | undefined;
  initialTravelType: TravelType | undefined;
}) {
  return useReducer(stationboardReducer, null, () => ({
    anchor: initialRequestedTime ?? initialCursors.now,
    departures: uniqueByTrip(initialDepartures),
    knownTravelTypes: addTravelTypes(availableTravelTypes, initialDepartures),
    nextCursor: initialCursors.next,
    previousCursor: initialCursors.prev,
    requestedTime: initialRequestedTime,
    travelType: initialTravelType,
  }));
}
