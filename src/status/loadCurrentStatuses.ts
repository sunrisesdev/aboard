import { getStopovers, getUserStatuses, type TraewellingClient } from '@/lib/traewelling';
import { getCheckinStopovers } from './getCheckinStopovers';
import { type CurrentStatuses, getCurrentStatuses } from './getCurrentStatuses';

// Only the active status gets its stopovers, for its direction and next stop. They're optional, so a failure only
// leaves them out. The time offset is passed on, so the client simulates the same time.
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
  const { active } = currentStatuses;

  if (!active) return currentStatuses;

  const activeStopovers = await getStopovers(client, [active.checkin.trip])
    .then((stopoversByTrip) => stopoversByTrip[active.checkin.trip])
    .then((tripStopovers) => tripStopovers && getCheckinStopovers(tripStopovers, active.checkin))
    .catch(() => undefined);

  return { ...currentStatuses, activeStopovers };
}
