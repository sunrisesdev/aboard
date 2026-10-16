import type { StationResource } from '@/lib/traewelling';

export const getStationHref = ({ id, name }: Pick<StationResource, 'id' | 'name'>) =>
  `/station/${id}?${new URLSearchParams({ name })}`;
