const dateFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeZone: 'UTC' });

// For date-only values (e.g. "2026-01-01"), which are parsed as UTC midnight
export function formatDate(date: string) {
  return dateFormat.format(new Date(date));
}
