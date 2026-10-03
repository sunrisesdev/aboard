import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CheckInContextProvider } from '@/checkin/CheckIn.context';
import { PageContent } from '@/components/PageContent/PageContent';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDepartures, TraewellingApiError, type TravelType } from '@/lib/traewelling';
import { Stationboard } from '@/station/Stationboard/Stationboard';
import { StationboardContextProvider } from '@/station/Stationboard/Stationboard.context';
import { StationboardTimePicker } from '@/station/StationboardTimePicker/StationboardTimePicker';
import { StationboardTravelTypeFilter } from '@/station/StationboardTravelTypeFilter/StationboardTravelTypeFilter';

const loadDepartures = async (
  accessToken: string,
  stationId: string,
  { requestedTime, travelType }: { requestedTime: string | undefined; travelType: TravelType | undefined },
) => {
  try {
    return await getDepartures(createTraewellingClient(accessToken), stationId, { when: requestedTime, travelType });
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
};

type DeparturesPromise = ReturnType<typeof loadDepartures>;

const StationName = async ({ departuresPromise }: { departuresPromise: DeparturesPromise }) => {
  const { meta } = await departuresPromise;

  return <h1>{meta.station.name}</h1>;
};

const StationboardLoader = async ({
  departuresPromise,
  stationId,
  travelType,
}: {
  departuresPromise: DeparturesPromise;
  stationId: string;
  travelType: TravelType | undefined;
}) => {
  const { data: departures, meta } = await departuresPromise;

  return (
    <Stationboard
      initialCursors={meta.times}
      initialDepartures={departures}
      stationId={stationId}
      travelType={travelType}
    />
  );
};

const StationboardSkeleton = () => {
  return (
    <ul>
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index}>
          <Skeleton width="100%" height="1.25rem" />
        </li>
      ))}
    </ul>
  );
};

export default async function StationboardPage({ params, searchParams }: PageProps<'/station/[stationId]'>) {
  const { stationId } = await params;
  const { at, name, travelType } = await searchParams;
  const session = await requireSession();

  // Not awaited: the station name and the departures stream in separately, while the filters are usable right away.
  const departuresPromise = loadDepartures(session.accessToken as string, stationId, {
    requestedTime: at as string | undefined,
    travelType: travelType as TravelType | undefined,
  });

  return (
    <main>
      <CheckInContextProvider>
        <StationboardContextProvider>
          <Suspense fallback={name ? <h1>{name}</h1> : <Skeleton width="12rem" height="1.5rem" />}>
            <StationName departuresPromise={departuresPromise} />
          </Suspense>
          <PageContent>
            <StationboardTravelTypeFilter />
            <StationboardTimePicker />
            <Suspense fallback={<StationboardSkeleton />}>
              <StationboardLoader
                departuresPromise={departuresPromise}
                stationId={stationId}
                travelType={travelType as TravelType | undefined}
              />
            </Suspense>
          </PageContent>
        </StationboardContextProvider>
      </CheckInContextProvider>
    </main>
  );
}
