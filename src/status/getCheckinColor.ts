import { getLineColors, getLineContrastColors } from '@/helpers/lineColors';
import type { TransportResource } from '@/lib/traewelling';
import { getCheckinMode } from './getCheckinMode';

// Color of a check-in's route on maps and timelines
export function getCheckinColor(checkin: TransportResource) {
  const { background } = getLineColors({ color: checkin.routeColor, mode: getCheckinMode(checkin) });

  return getLineContrastColors(background).tinted;
}
