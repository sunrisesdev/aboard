'use server';

import { cookies } from 'next/headers';
import { debugTimeCookie, isDebugTimeEnabled } from './debugTime';

// Stored as an offset rather than the time itself, so the simulated clock keeps running
export async function setDebugTimeAction(time: string) {
  const offset = Date.parse(time) - Date.now();

  if (!isDebugTimeEnabled || !Number.isFinite(offset)) return;

  (await cookies()).set(debugTimeCookie, String(offset), { httpOnly: true, sameSite: 'lax' });
}

export async function resetDebugTimeAction() {
  if (!isDebugTimeEnabled) return;

  (await cookies()).delete(debugTimeCookie);
}
