import type { TraewellingClient } from './client';
import type { UserProfile } from './types';

export async function getUser(client: TraewellingClient, username: string) {
  const { data } = await client.get(`v1/user/${encodeURIComponent(username)}`).json<{ data: UserProfile }>();

  return data;
}
