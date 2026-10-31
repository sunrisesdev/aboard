import { formatDateTime } from '@/helpers/formatDateTime';
import type { StatusResource } from '@/lib/traewelling';
import { getCheckinTimes } from './getCheckinTimes';

// Expects the statuses ordered by departure, so each day forms one consecutive run
export function groupStatusesByDay(statuses: StatusResource[]) {
  const days: { date: string; day: string; statuses: StatusResource[] }[] = [];

  for (const status of statuses) {
    const departure = getCheckinTimes(status.checkin).departure ?? status.createdAt;
    const date = formatDateTime(departure, 'isoDate');
    const lastDay = days.at(-1);

    if (lastDay?.date === date) {
      lastDay.statuses.push(status);
    } else {
      days.push({ date, day: formatDateTime(departure, 'day'), statuses: [status] });
    }
  }

  return days;
}
