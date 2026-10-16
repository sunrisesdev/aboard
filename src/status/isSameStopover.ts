import type { StopoverResource } from '@/lib/traewelling';

// Matched by stopover rather than station, since stations occur more than once on lines looping back.
// The uuid is the stable identifier, stopoverId is deprecated and only used while the uuid is missing.
export const isSameStopover = (a: StopoverResource, b: StopoverResource) =>
  a.uuid && b.uuid ? a.uuid === b.uuid : a.stopoverId === b.stopoverId;
