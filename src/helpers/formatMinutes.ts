const units = [
  { label: 'J', minutes: 365 * 24 * 60 },
  { label: 'T', minutes: 24 * 60 },
  { label: 'h', minutes: 60 },
  { label: 'min', minutes: 1 },
];

// E.g. "45 min", "3 h 5 min" or "1 J 12 T 4 h", leaving out empty units
export function formatMinutes(minutes: number) {
  let remaining = Math.round(minutes);
  const parts: string[] = [];

  for (const unit of units) {
    const value = Math.floor(remaining / unit.minutes);
    remaining %= unit.minutes;

    if (value) {
      parts.push(`${value.toLocaleString('de-DE')} ${unit.label}`);
    }
  }

  return parts.join(' ') || '0 min';
}
