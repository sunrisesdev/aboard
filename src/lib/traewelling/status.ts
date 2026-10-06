import type { TraewellingClient } from './client';
import type { components } from './schema';

export type StatusResource = components['schemas']['StatusResource'];

export async function getStatus(client: TraewellingClient, statusId: number) {
  const { data } = await client.get(`v1/status/${statusId}`).json<{ data: StatusResource }>();

  return data;
}
