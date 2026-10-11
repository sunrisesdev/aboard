import { toWallClockDate } from './toWallClockDate';

const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });

// Local time at the station, e.g. "13:37"
export function formatTime(iso: string) {
  return timeFormat.format(toWallClockDate(iso));
}
