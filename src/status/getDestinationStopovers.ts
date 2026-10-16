import type { StopoverResource, TransportResource } from '@/lib/traewelling';
import { isSameStopover } from './isSameStopover';

// The served stopovers after the origin, falling back to the current destination when the trip is unknown
export function getDestinationStopovers(
  stopovers: StopoverResource[] | undefined,
  { destination, origin }: TransportResource,
) {
  const originIndex = stopovers?.findIndex((stopover) => isSameStopover(stopover, origin)) ?? -1;

  if (!stopovers || originIndex < 0) {
    return [destination];
  }

  return stopovers
    .slice(originIndex + 1)
    .filter((stopover) => !stopover.cancelled || isSameStopover(stopover, destination));
}
