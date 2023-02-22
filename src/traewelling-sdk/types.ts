import { HAFASProductType } from './hafasTypes';

export type Station = {
  ibnr: number;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  rilIdentifer: string | null;
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
