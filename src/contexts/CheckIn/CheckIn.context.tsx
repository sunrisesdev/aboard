import { useSession } from 'next-auth/react';
import { PropsWithChildren, createContext, useReducer } from 'react';
import { checkInReducer, initialCheckInState } from './reducer';
import { CheckInContextValue } from './types';

const initialState = initialCheckInState();

export const CheckInContext = createContext<CheckInContextValue>({
  // currentStatus: undefined,
  // departureTime: undefined,
  // destination: undefined,
  // message: '',
  // origin: undefined,
  // setDepartureTime: () => void 0,
  // setDestination: () => void 0,
  // setMessage: () => void 0,
  // setTravelType: () => void 0,
  // setTrip: () => void 0,
  // setVisibility: () => void 0,
  // travelType: 0,
  // trip: undefined,
  // visibility: 0,

  confirm: () => void 0,
  join: () => void 0,
  perform: () => void 0,
  reportFailure: () => void 0,
  reportSuccess: () => void 0,
  reset: () => void 0,
  selectDestination: () => void 0,
  selectOrigin: () => void 0,
  selectTrip: () => void 0,
  state: initialState,
});

export const CheckInProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();

  const [state, dispatch] = useReducer(checkInReducer, initialState);

  const contextValue: CheckInContextValue = {
    confirm: (params) => dispatch({ ...params, type: 'confirm_check_in' }),
    join: (params) => dispatch({ ...params, type: 'join_check_in' }),
    perform: () => dispatch({ type: 'perform_check_in' }),
    reportFailure: (params) => dispatch({ ...params, type: 'report_failure' }),
    reportSuccess: (params) => dispatch({ ...params, type: 'report_success' }),
    reset: () => dispatch({ type: 'reset' }),
    selectDestination: (params) =>
      dispatch({ ...params, type: 'select_destination' }),
    selectOrigin: (params) => dispatch({ ...params, type: 'select_origin' }),
    selectTrip: (params) => dispatch({ ...params, type: 'select_trip' }),
    state,
  };

  return (
    <CheckInContext.Provider value={contextValue}>
      {children}
    </CheckInContext.Provider>
  );
};
