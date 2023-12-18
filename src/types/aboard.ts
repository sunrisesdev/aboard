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
  servesMethod?: Record<AboardMethod, boolean>;
  trwlId?: number; // = stop.id
};

export type AboardStatus = {
  createdAt: string;
  event: unknown; // TODO: add type
  id: string;
  isLikeable: boolean;
  journey: {
    destination: AboardStopover;
    distance: number;
    duration: number;
    hafasTripId: string;
    line: AboardLine;
    manualArrival: string;
    manualDeparture: string;
    origin: AboardStopover;
    pointsAwarded: number;
    runningNumber?: string;
    trwlTripId: number;
  };
  likeCount: number;
  likedByMe?: boolean;
  message: string;
  preventIndex: boolean;
  travelReason: AboardTravelReason;
  userAvatarUrl: string;
  userId: number;
  username: string;
  visibility: AboardVisibility;
};

export type AboardStopover = {
  arrival: Fluctuating<string | undefined>;
  departure: Fluctuating<string | undefined>;
  platform: Fluctuating<string | undefined>;
  station: AboardStation;
  status: 'additional' | 'cancelled' | 'scheduled';
};

export type AboardTravelReason = 'business' | 'commute' | 'private';

export type AboardTrip = {
  departure?: Fluctuating<string | undefined>;
  departureStation: AboardStation;
  designation: string; // TODO: find better name; = this is the line destination string
  destination: AboardStation;
  id: string; // HAFAS id
  line: AboardLine;
  origin?: AboardStation;
  platform?: Fluctuating<string | undefined>;
  runningNumber?: string;
  stopovers?: AboardStopover[];
};

export type AboardVisibility =
  | 'only-authenticated'
  | 'only-followers'
  | 'private'
  | 'public'
  | 'unlisted';

type Fluctuating<T> = {
  actual: T;
  planned: T;
};
