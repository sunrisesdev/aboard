const offsetPattern = /(?:([+-])(\d{2}):?(\d{2})|Z)$/;

/**
 * Shifts the instant by the UTC offset written in the ISO string, so formatting the result with
 * `timeZone: 'UTC'` yields the wall-clock time at the place the time refers to (e.g. the station).
 * @remarks Independent of the time zone of the server or browser, so both render the same output.
 */
export function toWallClockDate(iso: string) {
  const match = iso.match(offsetPattern);

  // Without an offset, the string already is the wall-clock time
  if (!match) {
    return new Date(`${iso}Z`);
  }

  const [, sign, hours, minutes] = match;
  const offsetInMinutes = sign ? (sign === '-' ? -1 : 1) * (Number(hours) * 60 + Number(minutes)) : 0;

  return new Date(new Date(iso).getTime() + offsetInMinutes * 60_000);
}
