import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import { getColorsByMotisMode } from './getColorsByMotisMode';
import { normalizeHexColor } from './normalizeHexColor';

export function getLineColor(line: DepartureResource['line']) {
  return normalizeHexColor(line.color ?? undefined) ?? getColorsByMotisMode(line.mode as MotisMode)?.[0];
}
