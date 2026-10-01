import { formatTime } from '@/helpers/formatTime';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import type { DepartureResource } from '@/lib/traewelling';
import { groupSplitTrains } from './groupSplitTrains';

export function groupByDepartureTime(departures: DepartureResource[]) {
  const groups = new Map<number, DepartureResource[]>();
  const sorted = departures.toSorted(
    (a, b) => new Date(getDepartureTime(a)).getTime() - new Date(getDepartureTime(b)).getTime(),
  );

  for (const departure of sorted) {
    const time = new Date(getDepartureTime(departure)).setSeconds(0, 0);
    groups.set(time, [...(groups.get(time) ?? []), departure]);
  }

  return [...groups].map(([time, timeDepartures]) => ({
    time,
    label: formatTime(getDepartureTime(timeDepartures[0])),
    groups: groupSplitTrains(timeDepartures),
  }));
}
