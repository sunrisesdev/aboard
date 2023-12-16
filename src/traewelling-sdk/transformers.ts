import {
  AboardLine,
  AboardLineAppearance,
  AboardMethod,
  AboardStation,
  AboardStopover,
  AboardTrip,
} from '@/types/aboard';
import {
  HAFASLine,
  HAFASProductType,
  HAFASStation,
  HAFASStop,
  HAFASTrip,
} from './hafasTypes';
import { Stop } from './types';

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

const TRWL_LINE_SHAPE_MAPPER: Record<string, AboardLineAppearance['shape']> = {
  hexagon: 'hexagon',
  pill: 'pill',
  rectangle: 'rectangle',
  'rectangle-rounded-corner': 'smooth-rectangle',
  trapezoid: 'trapezoid',
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
    id: trip.tripId,
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
  };
};

export const transformTrwlLineShape = (
  shape: string
): AboardLineAppearance['shape'] => {
  return TRWL_LINE_SHAPE_MAPPER[shape];
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
