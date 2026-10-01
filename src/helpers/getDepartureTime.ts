import type { DepartureResource } from '@/lib/traewelling';

export function getDepartureTime(departure: DepartureResource) {
  return departure.when ?? departure.plannedWhen;
}
