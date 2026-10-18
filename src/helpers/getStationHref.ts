import type { StationResource } from '@/lib/traewelling';

export const getStationHref = ({ id, name }: Pick<StationResource, 'id' | 'name'>, requestedTime?: string | null) =>
  `/station/${id}?${new URLSearchParams({ name, ...(requestedTime && { at: requestedTime }) })}`;
