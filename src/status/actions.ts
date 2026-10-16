'use server';

import { refresh, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  createTraewellingClient,
  deleteStatus,
  type StatusUpdateBody,
  TraewellingApiError,
  updateStatus,
} from '@/lib/traewelling';

export type StatusActionResult = { success: true } | { success: false; message: string };

export async function setStatusTimeToNowAction(
  statusId: number,
  stop: 'arrival' | 'departure',
): Promise<StatusActionResult> {
  const now = new Date().toISOString();

  return updateStatusAction(statusId, stop === 'arrival' ? { manualArrival: now } : { manualDeparture: now });
}

export async function updateStatusAction(statusId: number, body: StatusUpdateBody): Promise<StatusActionResult> {
  const session = await auth();
  if (!session || session.error) {
    return { success: false, message: 'Nicht angemeldet.' };
  }

  const client = createTraewellingClient(session.accessToken as string);

  try {
    await updateStatus(client, statusId, body);
  } catch (error) {
    if (error instanceof TraewellingApiError) {
      return { success: false, message: error.message };
    }

    throw error;
  }

  refresh();

  return { success: true };
}

export async function deleteStatusAction(statusId: number): Promise<StatusActionResult> {
  const session = await auth();
  if (!session || session.error) {
    return { success: false, message: 'Nicht angemeldet.' };
  }

  const client = createTraewellingClient(session.accessToken as string);

  try {
    await deleteStatus(client, statusId);
  } catch (error) {
    if (error instanceof TraewellingApiError) {
      return { success: false, message: error.message };
    }

    throw error;
  }

  // The layout shows the current statuses, which may include the deleted one
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}
