import type { DepartureResource } from '@/lib/traewelling';
import { getDepartureTime } from './getDepartureTime';

const lateThresholdInMinutes = 6;

export function getDelay(departure: DepartureResource) {
  const difference = new Date(getDepartureTime(departure)).getTime() - new Date(departure.plannedWhen).getTime();
  const minutes = Math.max(0, Math.round(difference / 60_000));

  if (minutes >= lateThresholdInMinutes) {
    return { minutes, status: 'late' } as const;
  }

  return { minutes, status: minutes > 0 ? 'slight' : 'onTime' } as const;
}
