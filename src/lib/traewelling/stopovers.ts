import type { TraewellingClient } from './client';
import type { StopoverResource } from './trip';

// The generated response type only knows the example key "1", so the trip id keys are typed by hand
export async function getStopovers(client: TraewellingClient, tripIds: number[]) {
  const { data } = await client
    .get(`v1/stopovers/${tripIds.join(',')}`)
    .json<{ data: Record<string, StopoverResource[]> }>();

  return data;
}
