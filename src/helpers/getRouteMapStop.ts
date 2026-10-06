import type { StopoverResource } from '@/lib/traewelling';
import type { RouteMapStop } from './buildRouteMapStyle';
import { cleanStationName } from './cleanStationName';

export function getRouteMapStop({ station }: StopoverResource) {
  return {
    coordinates: [station.longitude, station.latitude],
    name: cleanStationName(station.name),
  } satisfies RouteMapStop;
}
