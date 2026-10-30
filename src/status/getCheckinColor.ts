import { getLineColors } from '@/helpers/getLineColors';
import type { TransportResource } from '@/lib/traewelling';

// Color of a check-in's route on maps and timelines
export function getCheckinColor({ mode, routeColor }: TransportResource) {
  return getLineColors({ color: routeColor, mode }).background ?? 'var(--via-fg-primary)';
}
