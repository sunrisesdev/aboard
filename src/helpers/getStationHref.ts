import type { StationResource } from '@/lib/traewelling';

export function getStationHref({ id, name }: Pick<StationResource, 'id' | 'name'>, requestedTime?: string | null) {
  return `/station/${id}?${new URLSearchParams({ name, ...(requestedTime && { at: requestedTime }) })}`;
}
