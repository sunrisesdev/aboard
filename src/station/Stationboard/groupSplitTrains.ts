import { motisModeToTravelType } from '@/helpers/motisModeToTravelType';
import type { DepartureResource, TravelType } from '@/lib/traewelling';

const splittableTravelTypes: (TravelType | undefined)[] = ['express', 'regional', 'suburban'];

function getSplitTrainKey(departure: DepartureResource) {
  if (!departure.plannedPlatform && !departure.platform) return undefined;
  if (!splittableTravelTypes.includes(motisModeToTravelType(departure.line.mode))) return undefined;

  return [departure.plannedWhen, departure.plannedPlatform, departure.platform].join('|');
}

export function groupSplitTrains(departures: DepartureResource[]) {
  const groups = new Map<string, DepartureResource[]>();

  for (const departure of departures) {
    const key = getSplitTrainKey(departure) ?? departure.tripId;
    groups.set(key, [...(groups.get(key) ?? []), departure]);
  }

  return [...groups.values()];
}
