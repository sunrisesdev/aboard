import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient, getUserStatuses } from '@/lib/traewelling';
import { getCurrentStatuses } from '@/status/getCurrentStatuses';

export async function GET() {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = createTraewellingClient(session.accessToken as string);
  const statuses = await getUserStatuses(client, session.user.username);

  return NextResponse.json(getCurrentStatuses(statuses, new Date()));
}
