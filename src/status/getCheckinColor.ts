import { getContrastingLineColor } from '@/helpers/getContrastingLineColor';
import { getLineColors } from '@/helpers/getLineColors';
import type { TransportResource } from '@/lib/traewelling';
import { getCheckinMode } from './getCheckinMode';

// Color of a check-in's route on maps and timelines
export function getCheckinColor(checkin: TransportResource) {
  const { background } = getLineColors({ color: checkin.routeColor, mode: getCheckinMode(checkin) });

  return background ? getContrastingLineColor(background) : 'var(--via-fg-primary)';
}
