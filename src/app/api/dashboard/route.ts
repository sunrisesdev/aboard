import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient, getDashboard } from '@/lib/traewelling';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const page = Number(request.nextUrl.searchParams.get('page')) || 1;
  const client = createTraewellingClient(session.accessToken as string);
  const result = await getDashboard(client, page);

  return NextResponse.json(result);
}
