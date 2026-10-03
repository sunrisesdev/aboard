'use client';

import { createContext, type PropsWithChildren, useReducer } from 'react';
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
    case 'reset': {
      return initialCheckInState;
    }
  }
}

export const CheckInContext = createContext<CheckInContextValue | null>(null);

export const CheckInContextProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(checkInReducer, initialCheckInState);

  return <CheckInContext value={{ state, dispatch }}>{children}</CheckInContext>;
};
