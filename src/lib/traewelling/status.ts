import type { TraewellingClient } from './client';
import type { components, operations } from './schema';

export type StatusResource = components['schemas']['StatusResource'];

// The generated UserResource types the name fields as unknown, so the shared fields are taken from
// LightUserResource instead
export type StatusLike = Pick<
  components['schemas']['LightUserResource'],
  'displayName' | 'id' | 'profilePicture' | 'username'
>;

export async function getStatus(client: TraewellingClient, statusId: number) {
  const { data } = await client.get(`v1/status/${statusId}`).json<{ data: StatusResource }>();

  return data;
}

// Statuses of the current user and the users they follow, newest first. `nextPage` is undefined on the last page.
export async function getDashboard(client: TraewellingClient, page = 1) {
  const { data, links } = await client
    .get('v1/dashboard', { searchParams: { page } })
    .json<operations['getDashboard']['responses']['200']['content']['application/json']>();

  return { data, nextPage: links.next ? page + 1 : undefined };
}

// All statuses on the trip the current user is allowed to see, including the user's own
export async function getTripStatuses(client: TraewellingClient, tripId: number) {
  const { data } = await client.get(`v1/trips/${tripId}/statuses`).json<{ data: StatusResource[] }>();

  return data;
}

// Empty when the status author or the requesting user has deactivated likes
export async function getStatusLikes(client: TraewellingClient, statusId: number) {
  const { data } = await client.get(`v1/status/${statusId}/likes`).json<{ data: StatusLike[] }>();

  return data;
}
