export type HAFASLine = {
  additionalName?: string;
  adminCode: string;
  fahrtNr: string;
  id: string;
  mode: string;
  name: string;
  operator: HAFASOperator;
  product: HAFASProductType;
  productName: string;
  public: boolean;
  type: 'line';
};

export type HAFASLocation = {
  id?: string;
  latitude: number;
  longitude: number;
  type: 'location';
};

export type HAFASOperator = {
  id: string;
  name: string;
  type: 'operator';
};

export type HAFASProductType =
  | 'bus'
  | 'ferry'
  | 'national'
  | 'nationalExpress'
  | 'regional'
  | 'regionalExp'
  | 'suburban'
  | 'subway'
  | 'taxi'
  | 'tram';

export type HAFASStation = {
  id: string;
  location: HAFASLocation;
  name: string;
  products: Record<HAFASProductType, boolean>;
  type: 'station';
};

export type HAFASStatus = {
  code: 'journey-cancelled';
  text: string;
  type: 'status';
};

export type HAFASStop = {
  id: string;
  location: HAFASLocation;
  name: string;
  products: Record<HAFASProductType, boolean>;
  station: HAFASStation;
  type: 'stop';
};

export type HAFASTrip = {
  currentTripPosition: HAFASLocation;
  delay: number;
  destination: HAFASStop;
  direction: string;
  line: HAFASLine;
  loadFactor?: string;
  origin: HAFASStop | null;
  plannedPlatform: string | null;
  plannedWhen: string;
  platform: string | null;
  provenance: any;
  remarks: HAFASStatus[];
  station: {
    ibnr: number;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    rilIdentifier: string | null;
  };
  stop: HAFASStop;
  tripId: string;
  when: string | null;
};
