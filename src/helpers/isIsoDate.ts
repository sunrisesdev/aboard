// Only real calendar days in the format YYYY-MM-DD, e.g. no "2026-02-30"
export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().startsWith(value);
}
