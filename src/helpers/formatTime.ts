// Träwelling delivers all times in UTC, so they are displayed in a fixed time zone. Otherwise the server
// would render its own time zone and the browser the user's, causing wrong times and hydration mismatches.
const timeFormat = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });

// E.g. "13:37"
export function formatTime(iso: string) {
  return timeFormat.format(new Date(iso));
}
