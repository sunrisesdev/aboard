const units = [
  { abbreviation: 'J', label: 'Jahre', minutes: 365 * 24 * 60 },
  { abbreviation: 'T', label: 'Tage', minutes: 24 * 60 },
  { abbreviation: 'h', label: 'Stunden', minutes: 60 },
  { abbreviation: 'min', label: 'Minuten', minutes: 1 },
];

export function formatMinutes(minutes: number, { abbreviate = true }: { abbreviate?: boolean } = {}) {
  let remaining = Math.round(minutes);
  const parts: string[] = [];

  for (const unit of units) {
    const value = Math.floor(remaining / unit.minutes);
    remaining %= unit.minutes;

    if (value) {
      parts.push(`${value.toLocaleString('de-DE')} ${abbreviate ? unit.abbreviation : unit.label}`);
    }
  }

  return parts.join(' ') || (abbreviate ? '0 min' : '0 Minuten');
}
