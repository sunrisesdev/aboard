import { formatDateTime } from '@/helpers/formatDateTime';
import type { StatusResource } from '@/lib/traewelling';
import { getCheckinTimes } from './getCheckinTimes';

// Expects the statuses ordered by departure, so each day forms one consecutive run
export function groupStatusesByDay(statuses: StatusResource[]) {
  const days: { day: string; statuses: StatusResource[] }[] = [];

  for (const status of statuses) {
    const day = formatDateTime(getCheckinTimes(status.checkin).departure ?? status.createdAt, 'day');
    const lastDay = days.at(-1);

    if (lastDay?.day === day) {
      lastDay.statuses.push(status);
    } else {
      days.push({ day, statuses: [status] });
    }
  }

  return days;
}
