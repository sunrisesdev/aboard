import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CheckInContextProvider } from '@/checkin/CheckIn.context';
import { PageContent } from '@/components/PageContent/PageContent';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDepartures, TraewellingApiError, type TravelType } from '@/lib/traewelling';
import { Stationboard } from '@/station/Stationboard/Stationboard';

const StationboardLoader = async ({
  accessToken,
  at,
  stationId,
  travelType,
}: {
  accessToken: string;
  at: string | undefined;
  stationId: string;
  travelType: TravelType | undefined;
}) => {
  const client = createTraewellingClient(accessToken);

  let result: Awaited<ReturnType<typeof getDepartures>>;
  try {
    result = await getDepartures(client, stationId, { when: at, travelType });
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
      <PageContent>
        <Stationboard
          availableTravelTypes={meta.availableTravelTypes}
          initialCursors={meta.times}
          initialDepartures={departures}
          initialRequestedTime={at}
          initialTravelType={travelType}
          stationId={stationId}
        />
      </PageContent>
    </>
  );
};

const StationboardSkeleton = ({ name }: { name?: string }) => {
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
};

export default async function StationboardPage({ params, searchParams }: PageProps<'/station/[stationId]'>) {
  const { stationId } = await params;
  const { at, name, travelType } = await searchParams;
  const session = await requireSession();

  return (
    <main>
      <CheckInContextProvider>
        <Suspense fallback={<StationboardSkeleton name={name as string | undefined} />}>
          <StationboardLoader
            accessToken={session.accessToken as string}
            at={at as string | undefined}
            stationId={stationId}
            travelType={travelType as TravelType | undefined}
          />
        </Suspense>
      </CheckInContextProvider>
    </main>
  );
}
