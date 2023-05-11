'use server';

import { TraewellingSdk } from '@/traewelling-sdk';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const deleteStatus = async (id: string) => {
  await TraewellingSdk.status.remove({ id });

  revalidatePath(`/status/${id}`);
  redirect('/dashboard');
};
