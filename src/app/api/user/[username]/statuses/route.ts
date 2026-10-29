import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient, getUserStatuses } from '@/lib/traewelling';

export async function GET(request: NextRequest, { params }: RouteContext<'/api/user/[username]/statuses'>) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { username } = await params;
  const page = Number(request.nextUrl.searchParams.get('page')) || 1;
  const client = createTraewellingClient(session.accessToken as string);
  const result = await getUserStatuses(client, decodeURIComponent(username), page);

  return NextResponse.json(result);
}
