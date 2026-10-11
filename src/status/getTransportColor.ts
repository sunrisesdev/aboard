import { getColorsByMotisMode } from '@/helpers/getColorsByMotisMode';
import { normalizeHexColor } from '@/helpers/normalizeHexColor';
import type { TransportResource } from '@/lib/traewelling';

export function getTransportColor(transport: Pick<TransportResource, 'mode' | 'routeColor'>) {
  return normalizeHexColor(transport.routeColor ?? undefined) ?? getColorsByMotisMode(transport.mode ?? undefined)?.[0];
}
