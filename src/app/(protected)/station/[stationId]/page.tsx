import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CheckInContextProvider } from '@/checkin/CheckIn.context';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { PageContent } from '@/components/PageContent/PageContent';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDepartures, TraewellingApiError, type TravelType } from '@/lib/traewelling';
import { Stationboard } from '@/station/Stationboard/Stationboard';
import { StationboardContextProvider } from '@/station/Stationboard/Stationboard.context';
import { StationboardRadiusFilter } from '@/station/StationboardRadiusFilter/StationboardRadiusFilter';
import { StationboardSkeleton } from '@/station/StationboardSkeleton/StationboardSkeleton';
import { StationboardTimePicker } from '@/station/StationboardTimePicker/StationboardTimePicker';
import { StationboardTravelTypeFilter } from '@/station/StationboardTravelTypeFilter/StationboardTravelTypeFilter';
import { StationboardPageContent } from './content';
import styles from './Stationboard.module.css';

const loadDepartures = async (
  accessToken: string,
  stationId: string,
  {
    radius,
    requestedTime,
    travelType,
  }: { radius: number | undefined; requestedTime: string | undefined; travelType: TravelType | undefined },
) => {
  try {
    return await getDepartures(createTraewellingClient(accessToken), stationId, {
      radius,
      when: requestedTime,
      travelType,
    });
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

  return <h1 className={styles.title}>{meta.station.name}</h1>;
};

const StationboardLoader = async ({
  departuresPromise,
  radius,
  stationId,
  travelType,
}: {
  departuresPromise: DeparturesPromise;
  radius: number | undefined;
  stationId: string;
  travelType: TravelType | undefined;
}) => {
  const { data: departures, meta } = await departuresPromise;

  return (
    <Stationboard
      initialCursors={meta.times}
      initialDepartures={departures}
      radius={radius}
      stationId={stationId}
      travelType={travelType}
    />
  );
};

export default async function StationboardPage({ params, searchParams }: PageProps<'/station/[stationId]'>) {
  const { stationId } = await params;
  const { at, name, radius, travelType } = await searchParams;
  const session = await requireSession();

  // Not awaited: the station name and the departures stream in separately, while the filters are usable right away.
  const departuresPromise = loadDepartures(session.accessToken as string, stationId, {
    radius: radius ? Number(radius) : undefined,
    requestedTime: at as string | undefined,
    travelType: travelType as TravelType | undefined,
  });

  return (
    <CheckInContextProvider>
      <StationboardContextProvider>
        <PageContent>
          <Suspense
            fallback={
              name ? (
                <h1 className={styles.title}>{name}</h1>
              ) : (
                <Skeleton className={styles.title} height="1.25em" text width="12rem" />
              )
            }
          >
            <StationName departuresPromise={departuresPromise} />
          </Suspense>

          <div className={styles.controls}>
            <StationboardTimePicker />

            <ButtonGroup uneven>
              <StationboardRadiusFilter />
              <StationboardTravelTypeFilter />
            </ButtonGroup>
          </div>

          <StationboardPageContent>
            <Suspense fallback={<StationboardSkeleton />}>
              <StationboardLoader
                departuresPromise={departuresPromise}
                radius={radius ? Number(radius) : undefined}
                stationId={stationId}
                travelType={travelType as TravelType | undefined}
              />
            </Suspense>
          </StationboardPageContent>
        </PageContent>
      </StationboardContextProvider>
    </CheckInContextProvider>
  );
}
