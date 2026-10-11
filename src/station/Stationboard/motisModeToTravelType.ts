import type { TravelType } from '@/lib/traewelling';

const travelTypes: Record<string, TravelType> = {
  AIRPLANE: 'plane',
  BUS: 'bus',
  COACH: 'bus',
  FERRY: 'ferry',
  HIGHSPEED_RAIL: 'express',
  LONG_DISTANCE: 'express',
  METRO: 'subway',
  NIGHT_RAIL: 'express',
  RAIL: 'express',
  REGIONAL_FAST_RAIL: 'regional',
  REGIONAL_RAIL: 'regional',
  SUBURBAN: 'suburban',
  SUBWAY: 'subway',
  TRAM: 'tram',
};

export function motisModeToTravelType(mode: string | null | undefined) {
  return mode ? travelTypes[mode.toUpperCase()] : undefined;
}
