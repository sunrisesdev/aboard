export type AboardLine = {
  appearance: AboardLineAppearance;
  id: string;
  method: AboardMethod;
  name: string;
  operator: AboardOperator;
};

export type AboardLineAppearance = {
  accentColor?: string;
  background?: string;
  border?: string;
  color?: string;
  contrastColor?: string;
  lineName: string;
  productName: string;
  shape?:
    | 'circle'
    | 'hexagon'
    | 'pill'
    | 'rectangle'
    | 'regular-hexagon'
    | 'smooth-rectangle'
    | 'smooth-square'
    | 'square'
    | 'trapezoid';
};

export type AboardMethod =
  | 'bus'
  | 'ferry'
  | 'national-express'
  | 'national'
  | 'regional-express'
  | 'regional'
  | 'suburban'
  | 'subway'
  | 'taxi'
  | 'tram';

export type AboardOperator = {
  id: string;
  name: string;
};

export type AboardStation = {
  evaId?: number; // = hafasId, station.id
  ibnr?: number;
  latitude?: number;
  longitude?: number;
  name: string; // TODO: use db-clean-station-name in frontend maybe?
  rilId?: string;
  trwlId?: number; // = stop.id
};

export type AboardStopover = {
  arrival: Fluctuating<string | undefined>;
  departure: Fluctuating<string | undefined>;
  platform: Fluctuating<string | undefined>;
  station: AboardStation;
  status: 'additional' | 'cancelled' | 'scheduled';
};

export type AboardTrip = {
  id: string;
  designation: string; // TODO: find better name; = this is the line destination string
  departureStation: AboardStation;
  destination: AboardStation;
  line: AboardLine;
  origin?: AboardStation;
  runningNumber?: string;
  stopovers?: AboardStopover[];
};

type Fluctuating<T> = {
  actual: T;
  planned: T;
};
