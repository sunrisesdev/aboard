import type { StatusResource } from '@/lib/traewelling';
import type { getCheckinStopovers } from './getCheckinStopovers';
import { getCheckinTimes } from './getCheckinTimes';

// The stopovers and the time offset are added by loadCurrentStatuses
export type CurrentStatuses = {
  active?: StatusResource;
  activeStopovers?: ReturnType<typeof getCheckinStopovers>;
  next?: StatusResource;
  /** Milliseconds the clock is shifted by for debugging, see getDebugTimeOffset */
  timeOffset?: number;
};

// How far ahead an upcoming check-in counts, from now or from the arrival of the active one
const upcomingWindow = 60 * 60 * 1000;

// The active status is the running check-in (departed, not yet arrived), or else the next upcoming one, so it stays
// visible during a transfer. `next` is the one following it, e.g. to tell whether the transfer works out.
export function getCurrentStatuses(statuses: StatusResource[], now: Date): CurrentStatuses {
  const time = now.getTime();
  const timedStatuses = statuses.flatMap((status) => {
    const { arrival, departure } = getCheckinTimes(status.checkin);

    return arrival && departure ? [{ arrival: Date.parse(arrival), departure: Date.parse(departure), status }] : [];
  });

  const running = timedStatuses
    .filter(({ arrival, departure }) => departure <= time && time < arrival)
    .sort((a, b) => b.departure - a.departure)[0];
  const upcoming = timedStatuses.filter(({ departure }) => departure > time).sort((a, b) => a.departure - b.departure);
  const active = running ?? upcoming.find(({ departure }) => departure <= time + upcomingWindow);
  const next =
    active
    && upcoming.find(
      ({ departure, status }) => status !== active.status && departure <= active.arrival + upcomingWindow,
    );

  return { active: active?.status, next: next?.status };
}
