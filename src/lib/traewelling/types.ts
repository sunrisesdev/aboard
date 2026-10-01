import type { components } from './schema';

export type MotisMode = components['schemas']['MotisCategory'];

export type TraewellingUser = Omit<components['schemas']['UserAuthResource'], 'id'> & {
  id: string;
};
