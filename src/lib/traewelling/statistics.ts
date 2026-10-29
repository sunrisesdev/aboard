import type { TraewellingClient } from './client';
import type { operations } from './schema';

// All statuses of the current user departing on the given day (YYYY-MM-DD), along with the day's totals and the
// nearest days with check-ins
export async function getDailyStatistics(client: TraewellingClient, date: string) {
  const { data } = await client
    .get(`v1/statistics/daily/${encodeURIComponent(date)}`, { searchParams: { timezone: 'Europe/Berlin' } })
    .json<operations['getDailyStatistics']['responses']['200']['content']['application/json']>();

  return data;
}
