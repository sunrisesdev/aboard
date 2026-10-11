import { toWallClockDate } from './toWallClockDate';

const dateTimeFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });

// Local date and time at the place the time refers to, e.g. "17.07.2022, 13:37"
export function formatDateTime(iso: string) {
  return dateTimeFormat.format(toWallClockDate(iso));
}
