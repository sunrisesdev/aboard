// Träwelling delivers all times in UTC, so they are displayed in a fixed time zone. Otherwise the server
// would render its own time zone and the browser the user's, causing wrong times and hydration mismatches.
const formats = {
  // For date-only values (e.g. "2026-01-01"), which are parsed as UTC midnight
  date: new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'UTC' }),
  dateTime: new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' }),
  day: new Intl.DateTimeFormat('de-DE', { dateStyle: 'full', timeZone: 'Europe/Berlin' }),
  // Swedish formats dates as YYYY-MM-DD
  isoDate: new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeZone: 'Europe/Berlin' }),
  time: new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }),
};

// E.g. "17.07.2022" (date), "17.07.2022, 13:37" (dateTime), "Sonntag, 17. Juli 2022" (day), "2022-07-17" (isoDate)
// or "13:37" (time)
export function formatDateTime(value: string, format: keyof typeof formats = 'dateTime') {
  return formats[format].format(new Date(value));
}
