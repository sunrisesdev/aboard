import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDepartures, TraewellingApiError } from '@/lib/traewelling';
import { DepartureBoard } from './DepartureBoard';

export default async function StationPage({ params, searchParams }: PageProps<'/station/[id]'>) {
  const { id } = await params;
  const { at, name } = await searchParams;
  const session = await requireSession();

  return (
    <main>
      <Suspense fallback={<StationBoardSkeleton name={name as string | undefined} />}>
        <StationBoard accessToken={session.accessToken as string} id={id} at={at as string | undefined} />
      </Suspense>
    </main>
  );
}

async function StationBoard({ accessToken, id, at }: { accessToken: string; id: string; at: string | undefined }) {
  const client = createTraewellingClient(accessToken);

  let result: Awaited<ReturnType<typeof getDepartures>>;
  try {
    result = await getDepartures(client, id, { when: at });
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { data: departures, meta } = result;

  return (
    <>
      <h1>{meta.station.name}</h1>
      <DepartureBoard id={id} initialDepartures={departures} initialTimes={meta.times} initialAt={at} />
    </>
  );
}

function StationBoardSkeleton({ name }: { name?: string }) {
  return (
    <>
      {name ? <h1>{name}</h1> : <Skeleton width="12rem" height="1.5rem" />}
      <ul>
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index}>
            <Skeleton width="100%" height="1.25rem" />
          </li>
        ))}
      </ul>
    </>
  );
}
