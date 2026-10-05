'use server';

import { auth } from '@/lib/auth';
import {
  type Business,
  createCheckin,
  createTraewellingClient,
  type StatusVisibility,
  TraewellingApiError,
} from '@/lib/traewelling';

export type CheckinRequest = {
  tripId: string;
  lineName: string;
  start: number;
  destination: number;
  departure: string;
  arrival: string;
  body?: string | null;
  business?: Business;
  visibility?: StatusVisibility;
};

export type CheckinResult = { success: true } | { success: false; message: string };

export async function submitCheckinAction(request: CheckinRequest): Promise<CheckinResult> {
  const session = await auth();
  if (!session || session.error) {
    return { success: false, message: 'Nicht angemeldet.' };
  }

  const client = createTraewellingClient(session.accessToken as string);
  try {
    await createCheckin(client, request);
    return { success: true };
  } catch (error) {
    if (error instanceof TraewellingApiError) {
      return { success: false, message: error.message };
    }
    throw error;
  }
}
