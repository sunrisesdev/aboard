import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createTraewellingClient, getTripInfo, TraewellingApiError } from '@/lib/traewelling';

export async function GET(request: NextRequest, { params }: RouteContext<'/api/trip/[tripId]'>) {
  const session = await auth();
  if (!session || session.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { tripId } = await params;
  const lineName = request.nextUrl.searchParams.get('lineName');
  if (lineName === null) {
    return NextResponse.json({ message: 'Missing lineName' }, { status: 400 });
  }

  const client = createTraewellingClient(session.accessToken as string);

  try {
    const trip = await getTripInfo(client, { hafasTripId: decodeURIComponent(tripId), lineName });

    return NextResponse.json(trip);
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    throw error;
  }
}
