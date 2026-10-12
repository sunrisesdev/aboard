import type { DepartureResource } from '@/lib/traewelling';

// The actual platform is null without realtime data, so the planned one serves as fallback
export function getDeparturePlatform(departure: DepartureResource) {
  return departure.platform ?? departure.plannedPlatform;
}
