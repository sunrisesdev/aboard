import { cookies } from 'next/headers';

export const debugTimeCookie = 'debug-time-offset';

export const isDebugTimeEnabled = process.env.NODE_ENV === 'development';

// Shifts the clock of the current statuses by this many milliseconds, so trips that start or end soon can be tested at
// any time. Always 0 outside of development.
export async function getDebugTimeOffset() {
  if (!isDebugTimeEnabled) return 0;

  const offset = Number((await cookies()).get(debugTimeCookie)?.value);

  return Number.isFinite(offset) ? offset : 0;
}
