import type { components } from './schema';

/**
 * - `0` = private
 * - `1` = business
 * - `2` = commute
 */
export type Business = components['schemas']['Business'];

export type MotisMode = components['schemas']['MotisCategory'];

export type TraewellingUser = Omit<components['schemas']['UserAuthResource'], 'id'> & {
  id: string;
};
