import type { StopoverResource, TransportResource } from '@/lib/traewelling';
import { getCheckinTimes } from './getCheckinTimes';

// Expects the stopovers of the checked-in section only (see getCheckinStopovers)
export function getNextStopover(stopovers: StopoverResource[], checkin: TransportResource, now: Date) {
  const { arrival, departure } = getCheckinTimes(checkin);

  if (!departure || !arrival || now < new Date(departure) || now >= new Date(arrival)) {
    return undefined;
  }

  return (
    stopovers.slice(1).find((stopover) => {
      const time =
        stopover.arrivalReal ?? stopover.arrivalPlanned ?? stopover.departureReal ?? stopover.departurePlanned;

      return !stopover.cancelled && !!time && new Date(time) > now;
    }) ?? stopovers.at(-1)
  );
}
