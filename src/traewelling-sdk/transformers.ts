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
import {
  HAFASLine,
  HAFASProductType,
  HAFASStation,
  HAFASStop,
  HAFASTrip,
} from './hafasTypes';
import { Station, Status, Stop, Trip } from './types';

const HAFAS_PRODUCT_MAPPER: Record<HAFASProductType, AboardMethod> = {
  bus: 'bus',
  ferry: 'ferry',
  national: 'national',
  nationalExpress: 'national-express',
  regional: 'regional',
  regionalExp: 'regional-express',
  suburban: 'suburban',
  subway: 'subway',
  taxi: 'taxi',
  tram: 'tram',
};

const HIDDEN_PRODUCT_NAMES = ['Bus', 'Fäh', 'STB', 'STR'];

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

export const transformHAFASLine = (line: HAFASLine): AboardLine => {
  return {
    appearance: {
      lineName: line.name
        .replaceAll(
          new RegExp(`^(${HIDDEN_PRODUCT_NAMES.join('|')})(.)`, 'gi'),
          '$2'
        )
        .trim(),
      productName: line.productName,
    },
    id: line.id,
    method: transformHAFASProductType(line.product),
    name: line.name,
    operator: {
      id: line.operator.id,
      name: line.operator.name,
    },
  };
};

export const transformHAFASProductType = (
  productType: HAFASProductType
): AboardMethod => {
  return HAFAS_PRODUCT_MAPPER[productType];
};

export const transformHAFASStation = (station: HAFASStation): AboardStation => {
  return {
    evaId: +station.id,
    ibnr: undefined,
    latitude: station.location.latitude,
    longitude: station.location.longitude,
    name: station.name,
    rilId: undefined,
    servesMethod: Object.entries(station.products).reduce(
      (transformed, [product, value]) => ({
        ...transformed,
        [transformHAFASProductType(product as HAFASProductType)]: value,
      }),
      {}
    ) as AboardStation['servesMethod'],
    trwlId: undefined,
  };
};

export const transformHAFASStop = (stop: HAFASStop): AboardStation => {
  return {
    evaId: undefined,
    ibnr: +stop.id,
    latitude: stop.location.latitude,
    longitude: stop.location.longitude,
    name: stop.name,
    rilId: undefined,
    servesMethod: Object.entries(stop.products).reduce(
      (transformed, [product, value]) => ({
        ...transformed,
        [transformHAFASProductType(product as HAFASProductType)]: value,
      }),
      {}
    ) as AboardStation['servesMethod'],
    trwlId: undefined,
  };
};

export const transformHAFASTrip = (trip: HAFASTrip): AboardTrip => {
  return {
    departure: {
      actual: trip.when ?? undefined,
      planned: trip.plannedWhen ?? undefined,
    },
    departureStation: {
      evaId: trip.station.id,
      ibnr: trip.station.ibnr,
      latitude: +trip.station.latitude,
      longitude: +trip.station.longitude,
      name: trip.station.name,
      rilId: trip.station.rilIdentifier ?? undefined,
      servesMethod: Object.entries(trip.stop.products).reduce(
        (transformed, [product, value]) => ({
          ...transformed,
          [transformHAFASProductType(product as HAFASProductType)]: value,
        }),
        {}
      ) as AboardStation['servesMethod'],
      trwlId: undefined,
    },
    designation: trip.direction,
    destination: transformHAFASStop(trip.destination),
    hafasId: trip.tripId,
    line: transformHAFASLine(trip.line),
    origin: !trip.origin ? undefined : transformHAFASStop(trip.origin),
    platform: {
      actual: trip.platform ?? undefined,
      planned: trip.plannedPlatform ?? undefined,
    },
    runningNumber:
      !trip.line.fahrtNr || trip.line.fahrtNr === '0'
        ? undefined
        : trip.line.fahrtNr,
    stopovers: undefined,
    trwlId: undefined,
  };
};

export const transformTrwlLineShape = (
  shape: string
): AboardLineAppearance['shape'] => {
  return TRWL_LINE_SHAPE_MAPPER[shape];
};

export const transformTrwlStation = (station: Station): AboardStation => {
  return {
    evaId: undefined,
    ibnr: station.ibnr,
    latitude: station.latitude,
    longitude: station.longitude,
    name: station.name,
    rilId: station.rilIdentifier ?? undefined,
    servesMethod: undefined,
    trwlId: station.id,
  };
};

export const transformTrwlStatus = (status: Status): AboardStatus => {
  return {
    createdAt: status.createdAt,
    event: status.event,
    id: status.id,
    isLikeable: status.isLikable,
    journey: {
      destination: transformTrwlStop(status.train.destination),
      distance: status.train.distance,
      duration: status.train.duration,
      hafasTripId: status.train.hafasId,
      line: {
        appearance: {
          lineName: status.train.lineName,
          productName: '',
        },
        id: status.train.number,
        method: transformHAFASProductType(status.train.category),
        name: status.train.lineName,
        operator: {
          id: status.train.operator?.identifier ?? '',
          name: status.train.operator?.name ?? '',
        },
      },
      manualArrival: status.train.manualArrival,
      manualDeparture: status.train.manualDeparture,
      origin: transformTrwlStop(status.train.origin),
      pointsAwarded: status.train.points,
      trwlTripId: status.train.trip,
      runningNumber: status.train.journeyNumber?.toString() ?? '',
    },
    likeCount: status.likes,
    likedByMe: status.liked,
    message: status.body,
    preventIndex: status.preventIndex,
    travelReason: TRWL_BUSINESS_MAPPER[status.business],
    userAvatarUrl: status.profilePicture,
    userId: status.user,
    username: status.username,
    visibility: TRWL_VISIBILITY_MAPPER[status.visibility],
  };
};

export const transformTrwlStop = (stop: Stop): AboardStopover => {
  return {
    arrival: {
      actual: stop.arrival ?? stop.arrivalReal ?? undefined,
      planned: stop.arrivalPlanned ?? undefined,
    },
    departure: {
      actual: stop.departure ?? stop.departureReal ?? undefined,
      planned: stop.departurePlanned ?? undefined,
    },
    platform: {
      actual:
        stop.platform ??
        stop.arrivalPlatformReal ??
        stop.departurePlatformReal ??
        undefined,
      planned:
        stop.arrivalPlatformPlanned ??
        stop.departurePlatformPlanned ??
        undefined,
    },
    station: {
      evaId: stop.evaIdentifier,
      ibnr: undefined,
      latitude: undefined,
      longitude: undefined,
      name: stop.name,
      rilId: stop.rilIdentifier ?? undefined,
      trwlId: stop.id,
    },
    status: stop.cancelled ? 'cancelled' : 'scheduled',
  };
};

export const transformTrwlTrip = (trip: Trip): AboardTrip => {
  return {
    departure: undefined,
    departureStation: undefined,
    designation: trip.stopovers.at(-1)?.name ?? '',
    destination: transformTrwlStation(trip.destination),
    hafasId: undefined,
    line: {
      appearance: {
        lineName: trip.lineName,
        productName: '',
      },
      id: trip.number,
      method: transformHAFASProductType(trip.category),
      name: trip.lineName,
      operator: {
        id: '',
        name: '',
      },
    },
    origin: transformTrwlStation(trip.origin),
    platform: undefined,
    runningNumber: trip.journeyNumber?.toString(),
    stopovers: trip.stopovers.map(transformTrwlStop),
    trwlId: trip.id,
  };
};
