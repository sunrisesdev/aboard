import type { TraewellingClient } from './client';
import type { Polyline } from './polyline';
import type { operations } from './schema';

type DailyStatistics = operations['getDailyStatistics']['responses']['200']['content']['application/json']['data'];

// All statuses of the current user departing on the given day (YYYY-MM-DD), along with their polylines, the day's
// totals and the nearest days with check-ins. The schema types the polylines as a list of collections, but they come
// as a single collection with one feature per status.
export async function getDailyStatistics(client: TraewellingClient, date: string) {
  const { data } = await client
    .get(`v1/statistics/daily/${encodeURIComponent(date)}`, {
      searchParams: { timezone: 'Europe/Berlin', withPolylines: true },
    })
    .json<{ data: Omit<DailyStatistics, 'polylines'> & { polylines?: { features?: Polyline[] } | null } }>();

  return { ...data, polylines: data.polylines?.features ?? [] };
}
