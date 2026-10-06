import type { TransportResource } from '@/lib/traewelling';
import { getColorsByMotisMode } from './getColorsByMotisMode';
import { normalizeHexColor } from './normalizeHexColor';

export function getTransportColor(transport: Pick<TransportResource, 'mode' | 'routeColor'>) {
  return normalizeHexColor(transport.routeColor ?? undefined) ?? getColorsByMotisMode(transport.mode ?? undefined)?.[0];
}
