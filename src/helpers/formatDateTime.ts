// Fixed time zone for the same reason as in formatTime
const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Berlin',
});

// E.g. "17.07.2022, 13:37"
export function formatDateTime(iso: string) {
  return dateTimeFormat.format(new Date(iso));
}
