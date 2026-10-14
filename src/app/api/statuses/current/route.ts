import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient } from '@/lib/traewelling';
import { loadCurrentStatuses } from '@/status/loadCurrentStatuses';

export async function GET() {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = createTraewellingClient(session.accessToken as string);

  return NextResponse.json(await loadCurrentStatuses(client, session.user.username));
}
