import { HAFASProductType } from './hafasTypes';

export type TrwlLineColorDefinition = {
  backgroundColor: string;
  borderColor: string;
  hafasLineId: string;
  hafasOperatorCode: string;
  lineName: string;
  shape: string;
  shortOperatorName: string;
  textColor: string;
};

export type Station = {
  ibnr: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  rilIdentifier: string | null;
};

export type Status = {
  body: string;
  business: number;
  createdAt: string;
  event: any; // TODO: Add type
  id: string;
  liked: boolean;
  likes: number;
  preventIndex: boolean;
  train: Train;
  user: number;
  username: string;
  visibility: number;
  profilePicture: string;
  isLikable: boolean;
};

export type Stop = {
  arrival: string | null;
  arrivalPlanned: string | null;
  arrivalPlatformPlanned: string | null;
  arrivalPlatformReal: string | null;
  arrivalReal: string | null;
  cancelled: boolean;
  departure: string | null;
  departurePlanned: string | null;
  departurePlatformPlanned: string | null;
  departurePlatformReal: string | null;
  departureReal: string | null;
  evaIdentifier: number;
  id: number;
  isArrivalDelayed: boolean;
  isDepartureDelayed: boolean;
  name: string;
  platform: string | null;
  rilIdentifier: string | null;
};

export type Train = {
  category: HAFASProductType;
  destination: Stop;
  distance: number;
  duration: number;
  hafasId: string;
  lineName: string;
  number: string; // LINE ID
  origin: Stop;
  points: number;
  manualDeparture: string;
  manualArrival: string;
  trip: number;
  journeyNumber?: number;
  operator: {
    identifier: string;
    name: string;
  } | null;
};

export type TransportType =
  | 'bus'
  | 'express'
  | 'ferry'
  | 'regional'
  | 'suburban'
  | 'subway'
  | 'taxi'
  | 'tram';

export type Trip = {
  category: HAFASProductType;
  destination: Station;
  id: number;
  journeyNumber: number | null;
  lineName: string;
  number: string;
  origin: Station;
  stopovers: Stop[];
};

export type User = {
  displayName: string;
  home: Station | null;
  id: number;
  language: string | null;
  mastodonUrl: string | null;
  points: number;
  preventIndex: boolean;
  privacyHideDays: number | null;
  privateProfile: boolean;
  profilePicture: string;
  role: number; // TODO: Type
  trainDistance: number;
  trainDuration: number;
  trainSpeed: number;
  twitterUrl: string | null;
  username: string;
};

export type PublicUser = {
  displayName: string;
  following: boolean;
  followPending: boolean;
  id: number;
  mastodonUrl: string | null;
  muted: boolean;
  points: number;
  preventIndex: boolean;
  privateProfile: boolean;
  profilePicture: string;
  trainDistance: number;
  trainDuration: number;
  trainSpeed: number;
  twitterUrl: string | null;
  userInvisibleToMe: boolean;
  username: string;
};
