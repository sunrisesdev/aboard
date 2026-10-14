import { getStopovers, getUserStatuses, type TraewellingClient } from '@/lib/traewelling';
import { getCheckinStopovers } from './getCheckinStopovers';
import { type CurrentStatuses, getCurrentStatuses } from './getCurrentStatuses';

// Only the active status gets its stopovers, for its direction and next stop. They're optional, so a failure only
// leaves them out.
export async function loadCurrentStatuses(client: TraewellingClient, username: string): Promise<CurrentStatuses> {
  const statuses = await getUserStatuses(client, username);
  const currentStatuses = getCurrentStatuses(statuses, new Date());
  const { active } = currentStatuses;

  if (!active) return currentStatuses;

  const activeStopovers = await getStopovers(client, [active.checkin.trip])
    .then((stopoversByTrip) => stopoversByTrip[active.checkin.trip])
    .then((tripStopovers) => tripStopovers && getCheckinStopovers(tripStopovers, active.checkin))
    .catch(() => undefined);

  return { ...currentStatuses, activeStopovers };
}
