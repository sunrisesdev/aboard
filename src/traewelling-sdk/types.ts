import { HAFASProductType } from './hafasTypes';
import { MotisMode } from './motisTypes';

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
  id: number;
  latitude: number;
  longitude: number;
  name: string;
	areas: Area[];
	identifiers: StationIdentifier[],
	time_offset: number | null;
	created_at: string | null;
};

export type Area = {
	name: string;
	default: boolean;
	adminLevel: number;
};

export type StationIdentifier = {
	type: string;
	identifier: string;
	name: string | null;
	origin: string | null;
};

export type Status = {
  body: string;
  business: number;
  createdAt: string;
  event: any; // TODO: Add type
  id: number;
  isLikable: boolean;
  liked: boolean;
  likes: number;
	checkin: Transport;
  user: LightUser;
	createdBy: LightUser | null;
	tags: StatusTag[];
	moderation_notes: string | null;
	lock_visibility: boolean;
	hide_body: boolean;
  visibility: number;
};

export type StatusTag = {
	key: string;
	value: string;
	visibility: number;
};

export type Transport = {
	trip: number;
	hafasId: string;
	category: HAFASProductType;
	mode: MotisMode;
	number: string;
	lineName: string;
	routeColor: string | null;
	routeTextColor: string | null;
	journeyNumber: number;
	manualJourneyNumber: string | null;
	distance: number; // in meters
	points: number;
	duration: number; // in minutes
	manualDeparture: string | null;
	manualArrival: string | null;
	origin: Stopover;
	destination: Stopover;
	operator: Operator | null;
	dataSource: DataSource | null;
};

export type Stopover = {
	id: number;
	name: string;
	arrivalPlanned: string;
	arrivalReal: string | null;
	arrivalPlatformPlanned: string | null;
	arrivalPlatformReal: string | null;
	departurePlanned: string;
	departureReal: string | null;
	departurePlatformPlanned: string | null;
	departurePlatformReal: string | null;
	platform: string | null;
	isArrivalDelayed: boolean;
	isDepartureDelayed: boolean;
	cancelled: boolean;
};

export type Operator = {
	id: number;
	identifier: string;
	name: string;
};

export type DataSource = {
	id: string;
	attribution: string;
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

export type LightUser = {
	id: number;
	uuid: string;
	displayName: string;
	username: string;
	profilePicture: string;
	mastodon: any;
	preventIndex: boolean;
};

export type User = LightUser & {
  home: Station | null;
  language: string | null;
  points: number;
  privacyHideDays: number | null;
  privateProfile: boolean;
  role: number; // TODO: Type
  trainDistance: number;
  trainDuration: number;
  trainSpeed: number;
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

export type Departure = {
	tripId: string;
	stop: {
		type: 'stop';
		id: number;
		name: string;
		location: {
			type: 'location';
			id: string | null;
			latitude: number;
			longitude: number;
		}
	};
	when: string | null;
	plannedWhen: string;
	platform: string | null;
	plannedPlatform: string | null;
	direction: string;
	line: {
		type: 'line';
		id: string;
		fahrtNr: string;
		name: string;
		color: string | null;
		textColor: string | null;
		mode: MotisMode;
		product: HAFASProductType;
	};
	cancelled: boolean;
	station: Station;
};

export type Trip = {
	id: number;
	category: HAFASProductType,
	mode: MotisMode,
	number: string;
	lineName: string;
	journeyNumber: number;
	origin: Station;
	destination: Station;
	stopovers: Stopover[];
	dataSource: DataSource | null;
};
