/* eslint-disable indent */
import {
  AboardLine,
  AboardLineAppearance,
  AboardMethod,
  AboardStation,
  AboardStatus,
  AboardStopover,
  AboardTravelReason,
  AboardTrip,
  AboardVisibility,
} from '@/types/aboard';
import { Departure, Station, Status, Stopover, Trip } from './types';
import { MotisMode } from './motisTypes';

const MOTIS_PRODUCT_MAPPER: Record<MotisMode, AboardMethod> = {
  BUS: 'bus',
  COACH: 'bus',
  FERRY: 'ferry',
  REGIONAL_RAIL: 'national',
  HIGHSPEED_RAIL: 'national-express',
  RAIL: 'regional',
  REGIONAL_FAST_RAIL: 'regional-express',
  SUBURBAN: 'suburban',
  METRO: 'suburban',
  SUBWAY: 'subway',
  CAR: 'taxi',
  TRAM: 'tram',
  AERAL_LIFT: 'aerial',
  AERIAL_LIFT: 'aerial',
  AIRPLANE: 'airplane',
  BIKE: '_',
  CABLE_CAR: 'aerial',
  CAR_DROPOFF: '_',
  CAR_PARKING: '_',
  FLEX: 'taxi',
  FUNICULAR: 'funicular',
  LONG_DISTANCE: '_',
  NIGHT_RAIL: 'national',
  ODM: '_',
  OTHER: '_',
  RENTAL: '_',
  RIDE_SHARING: '_',
  TRANSIT: '_',
  WALK: '_',
};

const TRWL_BUSINESS_MAPPER: AboardTravelReason[] = [
  'private',
  'business',
  'commute',
];

const TRWL_LINE_SHAPE_MAPPER: Record<string, AboardLineAppearance['shape']> = {
  hexagon: 'hexagon',
  pill: 'pill',
  rectangle: 'rectangle',
  'rectangle-rounded-corner': 'smooth-rectangle',
  trapezoid: 'trapezoid',
};

const TRWL_VISIBILITY_MAPPER: AboardVisibility[] = [
  'public',
  'unlisted',
  'only-followers',
  'private',
  'only-authenticated',
];

export const transformAboardTravelReason = (
  travelReason: AboardTravelReason
): number => {
  return TRWL_BUSINESS_MAPPER.indexOf(travelReason);
};

export const transformAboardVisibility = (
  visibility: AboardVisibility
): number => {
  return TRWL_VISIBILITY_MAPPER.indexOf(visibility);
};

// export const transformHAFASLine = (line: HAFASLine): AboardLine => {
//   return {
//     appearance: {
//       lineName: line.name
//         .replaceAll(
//           new RegExp(`^(${HIDDEN_PRODUCT_NAMES.join('|')})(.)`, 'gi'),
//           '$2'
//         )
//         .trim(),
//       productName: line.productName,
//     },
//     id: line.id,
//     method: transformHAFASProductType(line.product),
//     name: line.name,
//     operator: !line.operator
//       ? undefined
//       : {
//           id: line.operator.id,
//           name: line.operator.name,
//         },
//   };
// };

export const transformMotisMode = (
  mode: MotisMode
): AboardMethod => {
  return MOTIS_PRODUCT_MAPPER[mode];
};

// export const transformHAFASStop = (stop: HAFASStop): AboardStation => {
//   return {
//     evaId: undefined,
//     ibnr: +stop.id,
//     latitude: stop.location.latitude,
//     longitude: stop.location.longitude,
//     name: stop.name,
//     rilId: undefined,
//     servesMethod: Object.entries(stop.products).reduce(
//       (transformed, [product, value]) => ({
//         ...transformed,
//         [transformHAFASProductType(product as HAFASProductType)]: value,
//       }),
//       {}
//     ) as AboardStation['servesMethod'],
//     trwlId: undefined,
//   };
// };

// export const transformHAFASTrip = (trip: HAFASTrip): AboardTrip => {
//   return {
//     departure: {
//       actual: trip.when ?? undefined,
//       planned: trip.plannedWhen ?? undefined,
//     },
//     departureStation: {
//       evaId: trip.station.id,
//       ibnr: trip.station.ibnr,
//       latitude: +trip.station.latitude,
//       longitude: +trip.station.longitude,
//       name: trip.station.name,
//       rilId: trip.station.rilIdentifier ?? undefined,
//       servesMethod: Object.entries(trip.stop.products).reduce(
//         (transformed, [product, value]) => ({
//           ...transformed,
//           [transformHAFASProductType(product as HAFASProductType)]: value,
//         }),
//         {}
//       ) as AboardStation['servesMethod'],
//       trwlId: undefined,
//     },
//     designation: trip.direction,
//     destination: transformHAFASStop(trip.destination),
//     hafasId: trip.tripId,
//     line: transformHAFASLine(trip.line),
//     origin: !trip.origin ? undefined : transformHAFASStop(trip.origin),
//     platform: {
//       actual: trip.platform ?? undefined,
//       planned: trip.plannedPlatform ?? undefined,
//     },
//     runningNumber:
//       !trip.line.fahrtNr || trip.line.fahrtNr === '0'
//         ? undefined
//         : trip.line.fahrtNr,
//     stopovers: undefined,
//     trwlId: undefined,
//   };
// };

export const transformTrwlLineShape = (
  shape: string
): AboardLineAppearance['shape'] => {
  return TRWL_LINE_SHAPE_MAPPER[shape];
};

export const transformTrwlStation = (station: Station): AboardStation => {
  return {
    evaId: undefined,
    ibnr: +station.identifiers?.filter(id => id.type === 'de_db_ibnr')[0]?.identifier,
    latitude: station.latitude,
    longitude: station.longitude,
    name: station.name,
    rilId: station.identifiers?.filter(id => id.type === 'de_db_ril100')[0]?.identifier,
    servesMethod: undefined,
    trwlId: station.id,
  };
};

export const transformTrwlStopover = (stopover: Stopover): AboardStopover => {
  return {
    station: {
      trwlId: stopover.id,
      name: stopover.name,
    },
    arrival: {
      planned: stopover.arrivalPlanned,
      actual: stopover.arrivalReal ?? undefined,
    },
    departure: {
      planned: stopover.departurePlanned,
      actual: stopover.departureReal ?? undefined,
    },
    platform: {
      planned: stopover.departurePlatformPlanned ?? stopover.arrivalPlatformPlanned ?? undefined,
      actual: stopover.departurePlatformReal ?? stopover.arrivalPlatformReal ?? undefined,
    },
    status: stopover.cancelled ? 'cancelled' : 'scheduled',
  };
};

export const transformTrwlColor = (color: string | null): (string | undefined) => {
  if (!color) return;
  return `#${color}`;
};

export const transformTrwlStatus = (status: Status): AboardStatus => {
  return {
    createdAt: status.createdAt,
    event: status.event,
    id: status.id.toString(),
    isLikeable: status.isLikable,
    journey: {
      destination: transformTrwlStop(status.checkin.destination),
      distance: status.checkin.distance,
      duration: status.checkin.duration,
      hafasTripId: status.checkin.hafasId,
      line: {
        appearance: {
          lineName: status.checkin.lineName
            .trim(),
          color: transformTrwlColor(status.checkin.routeTextColor),
          background: transformTrwlColor(status.checkin.routeColor),
          productName: '',
        },
        id: status.checkin.number,
        method: transformMotisMode(status.checkin.mode),
        name: status.checkin.lineName,
        operator: {
          id: status.checkin.operator?.identifier ?? '',
          name: status.checkin.operator?.name ?? '',
        },
      },
      manualArrival: status.checkin.manualArrival ?? status.checkin.destination.arrivalReal ?? status.checkin.destination.arrivalPlanned,
      manualDeparture: status.checkin.manualDeparture ?? status.checkin.origin.departureReal ?? status.checkin.origin.departurePlanned,
      origin: transformTrwlStop(status.checkin.origin),
      pointsAwarded: status.checkin.points,
      trwlTripId: status.checkin.trip,
      runningNumber: status.checkin.journeyNumber?.toString() ?? '',
    },
    likeCount: status.likes,
    likedByMe: status.liked,
    message: status.body,
    preventIndex: status.user.preventIndex,
    travelReason: TRWL_BUSINESS_MAPPER[status.business],
    userAvatarUrl: status.user.profilePicture,
    userId: status.user.id,
    username: status.user.username,
    visibility: TRWL_VISIBILITY_MAPPER[status.visibility],
  };
};

export const transformTrwlStop = (stop: Stopover): AboardStopover => {
  return {
    arrival: {
      actual: stop.arrivalReal ?? undefined,
      planned: stop.arrivalPlanned ?? undefined,
    },
    departure: {
      actual: stop.departureReal ?? undefined,
      planned: stop.departurePlanned ?? undefined,
    },
    platform: {
      actual:
        stop.arrivalPlatformReal ??
        stop.departurePlatformReal ??
        undefined,
      planned:
        stop.arrivalPlatformPlanned ??
        stop.departurePlatformPlanned ??
        undefined,
    },
    station: {
      evaId: undefined,
      ibnr: undefined,
      latitude: undefined,
      longitude: undefined,
      name: stop.name,
      rilId: undefined,
      trwlId: stop.id,
    },
    status: stop.cancelled ? 'cancelled' : 'scheduled',
  };
};

export const transformTrwlTrip = (trip: Trip): AboardTrip => {
  return {
    designation: trip.destination.name ?? '',
    destination: transformTrwlStation(trip.destination),
    line: {
      appearance: {
        lineName: trip.lineName,
        productName: '',
      },
      id: trip.number,
      method: transformMotisMode(trip.mode),
      name: trip.lineName,
      operator: {
        id: '',
        name: '',
      },
    },
    stopovers: trip.stopovers.map(transformTrwlStopover),
    origin: transformTrwlStation(trip.origin),
    platform: undefined,
    runningNumber: trip.journeyNumber?.toString(),
    trwlId: trip.id,
    hafasId: trip.id.toString(),
  };
};

export const transformTrwlDeparture = (departure: Departure): AboardTrip => {
  return {
    designation: departure.direction,
    destination: {
      name: departure.direction,
    },
    line: {
      appearance: {
        lineName: departure.line.name,
        color: transformTrwlColor(departure.line.textColor),
        background: transformTrwlColor(departure.line.color),
        productName: '',
      },
      id: departure.line.id,
      method: transformMotisMode(departure.line.mode),
      name: departure.line.name,
      operator: {
        id: '',
        name: '',
      },
    },
    platform: {
      actual: departure.platform ?? undefined,
      planned: departure.plannedPlatform ?? undefined,
    },
    departure: {
      planned: departure.plannedWhen,
      actual: departure.when ?? undefined,
    },
    departureStation: transformTrwlStation(departure.station),
    runningNumber: departure.line.fahrtNr,
    hafasId: departure.tripId,
  };
};
