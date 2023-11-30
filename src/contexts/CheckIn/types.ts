import { HAFASTrip } from '@/traewelling-sdk/hafasTypes';
import { Station, Status, Stop, Trip } from '@/traewelling-sdk/types';

type CheckInStatus = 'draft' | 'ready' | 'loading' | 'completed';

type StationIdentity = Pick<Station, 'ibnr' | 'name' | 'rilIdentifier'>;

export type CheckInContextValue = {
  // currentStatus: Status | null | undefined;
  // departureTime: string | undefined;
  // destination: Stop | undefined;
  // message: string;
  // origin: StationIdentity | undefined;
  // setDepartureTime: (value: string | undefined) => void;
  // setDestination: (value: Stop | undefined) => void;
  // setMessage: (value: string) => void;
  // setTravelType: (value: number) => void;
  // setTrip: (value: HAFASTrip | undefined) => void;
  // setVisibility: (value: number) => void;
  // travelType: number;
  // trip: HAFASTrip | undefined;
  // visibility: number;

  confirm: (params: Omit<ConfirmCheckInAction, 'type'>) => void;
  join: (params: Omit<JoinCheckInAction, 'type'>) => void;
  perform: () => void;
  reportFailure: (params: Omit<ReportFailureAction, 'type'>) => void;
  reportSuccess: (params: Omit<ReportSuccessAction, 'type'>) => void;
  reset: () => void;
  selectDestination: (params: Omit<SelectDestinationAction, 'type'>) => void;
  selectOrigin: (params: Omit<SelectOriginAction, 'type'>) => void;
  selectTrip: (params: Omit<SelectTripAction, 'type'>) => void;
  state: CheckInState;
};

export type CheckInState = {
  departureTime: string | undefined;
  destination: Stop | undefined;
  hafasId: string | undefined;
  message: string;
  origin: StationIdentity | undefined;
  status: CheckInStatus;
  travelType: number;
  trip: Trip | undefined;
  tripFinderArgs:
    | {
        id: string;
        lineName: string;
        start: number;
      }
    | undefined;
  visibility: number;
};

type ConfirmCheckInAction = {
  type: 'confirm_check_in';

  message: string;
  travelType: number;
  visibility: number;
};

type JoinCheckInAction = {
  type: 'join_check_in';

  status: Status;
  trip?: Trip;
};

type PerformCheckInAction = {
  type: 'perform_check_in';
};

type ReportFailureAction = {
  type: 'report_failure';

  // TODO
  error?: any;
};

type ReportSuccessAction = {
  type: 'report_success';

  // TODO
  data?: any;
};

type ResetAction = {
  type: 'reset';
};

type SelectDepartureTimeAction = {
  type: 'select_departure_time';

  departureTime: string | undefined;
};

type SelectDestinationAction = {
  type: 'select_destination';

  destination: Stop;
};

type SelectOriginAction = {
  type: 'select_origin';

  origin: StationIdentity;
};

type SelectTripAction = {
  type: 'select_trip';

  trip: HAFASTrip;
};

export type CheckInAction =
  | ConfirmCheckInAction
  | JoinCheckInAction
  | PerformCheckInAction
  | ReportFailureAction
  | ReportSuccessAction
  | ResetAction
  | SelectDepartureTimeAction
  | SelectDestinationAction
  | SelectOriginAction
  | SelectTripAction;
