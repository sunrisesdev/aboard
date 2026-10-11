import { cleanStationName } from '@/helpers/cleanStationName';
import type { StopoverResource } from '@/lib/traewelling';
import type { RouteMapStop } from './buildRouteMapStyle';

export function getRouteMapStop({ station }: StopoverResource) {
  return {
    coordinates: [station.longitude, station.latitude],
    name: cleanStationName(station.name),
  } satisfies RouteMapStop;
}
