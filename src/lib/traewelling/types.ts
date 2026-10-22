import type { components } from './schema';

/**
 * - `0` = private
 * - `1` = business
 * - `2` = commute
 */
export type Business = components['schemas']['Business'];

export type MotisMode = components['schemas']['MotisCategory'];

/**
 * - `0` = public
 * - `1` = unlisted
 * - `2` = followers
 * - `3` = private
 * - `4` = authenticated
 * - `5` = trusted
 */
export type StatusVisibility = components['schemas']['StatusVisibility'];

export type TransportResource = components['schemas']['TransportResource'];

// The schema types these fields as unknown
export type UserProfile = Omit<
  components['schemas']['UserResource'],
  'displayName' | 'mastodonUrl' | 'profilePicture' | 'username'
> & {
  displayName: string;
  mastodonUrl: string | null;
  profilePicture: string;
  username: string;
};

export type TraewellingUser = Omit<components['schemas']['UserAuthResource'], 'id'> & {
  id: string;
};
