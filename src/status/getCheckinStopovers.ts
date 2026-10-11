import type { StopoverResource, TransportResource } from '@/lib/traewelling';

// The stopovers cover the whole trip, so they're limited to the checked-in section. The trip's last
// stop that is actually served is kept as the direction, since the checkin doesn't contain it.
export function getCheckinStopovers(stopovers: StopoverResource[], { destination, origin }: TransportResource) {
  const direction = stopovers.findLast((stopover) => !stopover.cancelled);

  // Matched by stopover rather than station, since stations occur more than once on lines looping back.
  // The uuid is the stable identifier, stopoverId is deprecated and only used while the uuid is missing.
  const isSameStopover = (a: StopoverResource, b: StopoverResource) =>
    a.uuid && b.uuid ? a.uuid === b.uuid : a.stopoverId === b.stopoverId;

  const originIndex = stopovers.findIndex((stopover) => isSameStopover(stopover, origin));
  const destinationIndex = stopovers.findLastIndex((stopover) => isSameStopover(stopover, destination));

  return {
    direction,
    stopovers:
      originIndex >= 0 && destinationIndex > originIndex
        ? stopovers.slice(originIndex, destinationIndex + 1)
        : [origin, destination],
  };
}
