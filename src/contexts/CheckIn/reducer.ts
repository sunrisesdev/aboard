/* eslint-disable indent */
import { CheckInAction, CheckInState } from './types';

export const initialCheckInState = (): CheckInState => ({
  departureTime: undefined,
  destination: undefined,
  message: '',
  origin: undefined,
  status: 'draft',
  travelType: 0,
  trip: undefined,
  tripFinderArgs: undefined,
  visibility: 0,
});

export const checkInReducer = (
  state: CheckInState,
  action: CheckInAction
): CheckInState => {
  console.log(action);

  switch (action.type) {
    case 'confirm_check_in':
      return {
        ...state,
        message: action.message,
        status: 'ready',
        travelType: action.travelType,
        visibility: action.visibility,
      };
    case 'join_check_in':
      return {
        ...initialCheckInState(),
        message: action.status.body,
        origin: {
          ibnr: action.status.train.origin.evaIdentifier,
          name: action.status.train.origin.name,
          rilIdentifier: action.status.train.origin.rilIdentifier,
        },
        travelType: action.status.business,
        trip: action.trip,
      };
    case 'perform_check_in':
      return { ...state, status: 'loading' };
    case 'report_failure':
      return { ...state, status: 'draft' };
    case 'report_success':
      return { ...state, status: 'completed' };
    case 'reset':
      return initialCheckInState();
    case 'select_departure_time':
      return { ...state, departureTime: action.departureTime };
    case 'select_destination':
      return { ...state, destination: action.destination };
    case 'select_origin':
      return { ...initialCheckInState(), origin: action.origin };
    case 'select_trip':
      return {
        ...state,
        destination: undefined,
        trip: action.trip,
        tripFinderArgs: undefined,
      };
  }
};
