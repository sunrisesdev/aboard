import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient, stationHistory } from '@/lib/traewelling';

export async function GET() {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = createTraewellingClient(session.accessToken as string);

  return NextResponse.json(await stationHistory(client));
}
