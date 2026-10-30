import type { HafasTravelType, MotisMode, TransportResource } from '@/lib/traewelling';

// Taxis have no equivalent
const modesByCategory: Partial<Record<HafasTravelType, MotisMode>> = {
  bus: 'BUS',
  ferry: 'FERRY',
  freightTrain: 'RAIL',
  national: 'LONG_DISTANCE',
  nationalExpress: 'HIGHSPEED_RAIL',
  plane: 'AIRPLANE',
  regional: 'REGIONAL_RAIL',
  regionalExp: 'REGIONAL_FAST_RAIL',
  suburban: 'SUBURBAN',
  subway: 'SUBWAY',
  tram: 'TRAM',
};

// Older check-ins only have the HAFAS category
export function getCheckinMode({ category, mode }: Pick<TransportResource, 'category' | 'mode'>) {
  return mode ?? modesByCategory[category];
}
