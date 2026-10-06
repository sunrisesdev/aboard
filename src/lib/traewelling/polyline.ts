import type { TraewellingClient } from './client';
import type { components, operations } from './schema';

export type Polyline = components['schemas']['Polyline'];

type PolylinesResponse = operations['getPolylines']['responses'][200]['content']['application/json'];

export async function getPolylines(client: TraewellingClient, statusIds: number[]) {
  const { data } = await client.get(`v1/polyline/${statusIds.join(',')}`).json<PolylinesResponse>();

  return data.features ?? [];
}
