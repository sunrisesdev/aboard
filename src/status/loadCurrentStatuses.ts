import { getStopovers, getUserStatuses, type StatusResource, type TraewellingClient } from '@/lib/traewelling';
import { getCheckinStopovers } from './getCheckinStopovers';
import { type CurrentStatuses, getCurrentStatuses } from './getCurrentStatuses';

// The active status gets its stopovers for its direction and next stop, the next status only for its direction. Both
// come in one request. They're optional, so a failure only leaves them out. The time offset is passed on, so the
// client simulates the same time.
export async function loadCurrentStatuses(
  client: TraewellingClient,
  username: string,
  timeOffset = 0,
): Promise<CurrentStatuses> {
  const statuses = await getUserStatuses(client, username);
  const currentStatuses = {
    ...getCurrentStatuses(statuses, new Date(Date.now() + timeOffset)),
    timeOffset: timeOffset || undefined,
  };
  const { active, next } = currentStatuses;

  if (!active) return currentStatuses;

  const trips = new Set([active.checkin.trip, ...(next ? [next.checkin.trip] : [])]);
  const stopoversByTrip = await getStopovers(client, [...trips]).catch(() => undefined);
  const getStopoversOf = ({ checkin }: StatusResource) => {
    const tripStopovers = stopoversByTrip?.[checkin.trip];

    return tripStopovers && getCheckinStopovers(tripStopovers, checkin);
  };

  return {
    ...currentStatuses,
    activeStopovers: getStopoversOf(active),
    nextStopovers: next && getStopoversOf(next),
  };
}
