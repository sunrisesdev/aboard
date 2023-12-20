/* eslint-disable indent */
import { transformAboardTravelReason } from '@/traewelling-sdk/transformers';
import { CheckInAction, CheckInState } from './types';

export const initialCheckInState = (): CheckInState => ({
  departureTime: undefined,
  destination: undefined,
  hafasId: undefined,
  message: '',
  origin: undefined,
  status: 'draft',
  travelReason: 0,
  trip: undefined,
  visibility: 0,
});

export const checkInReducer = (
  state: CheckInState,
  action: CheckInAction
): CheckInState => {
  switch (action.type) {
    case 'confirm_check_in':
      return {
        ...state,
        message: action.message,
        status: 'ready',
        travelReason: action.travelType,
        visibility: action.visibility,
      };
    case 'join_check_in':
      return {
        ...initialCheckInState(),
        departureTime: action.status.journey.origin.departure.planned,
        hafasId: action.status.journey.hafasTripId,
        message: action.status.message,
        origin: action.status.journey.origin.station,
        travelReason: transformAboardTravelReason(action.status.travelReason),
        trip: action.trip,
      };
    case 'perform_check_in':
      return { ...state, status: 'loading' };
    case 'report_failure':
      return {
        ...state,
        status: 'draft',
        message: JSON.stringify(action.error),
      };
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
        hafasId: action.trip.hafasId,
        trip: action.trip,
      };
  }
};
