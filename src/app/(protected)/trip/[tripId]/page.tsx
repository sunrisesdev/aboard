import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ColoredLayer } from '@/components/ColoredLayer/ColoredLayer';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatTime } from '@/helpers/formatTime';
import { getColorsByMotisMode } from '@/helpers/getColorsByMotisMode';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getTripInfo, TraewellingApiError } from '@/lib/traewelling';
import { TripStopoverList } from './TripStopoverList';

export default async function TripPage({ params, searchParams }: PageProps<'/trip/[tripId]'>) {
  const { tripId } = await params;
  const { station, time, line } = await searchParams;
  const session = await requireSession();

  return (
    <main>
      <Suspense fallback={<TripStopoversSkeleton />}>
        <TripStopovers
          accessToken={session.accessToken as string}
          tripId={tripId}
          station={station as string | undefined}
          time={time as string | undefined}
          line={line as string | undefined}
        />
      </Suspense>
    </main>
  );
}

async function TripStopovers({
  accessToken,
  tripId,
  station,
  time,
  line,
}: {
  accessToken: string;
  tripId: string;
  station: string | undefined;
  time: string | undefined;
  line: string | undefined;
}) {
  const client = createTraewellingClient(accessToken);

  let trip: Awaited<ReturnType<typeof getTripInfo>>;
  try {
    trip = await getTripInfo(client, {
      hafasTripId: decodeURIComponent(tripId),
      lineName: line as string,
    });
  } catch (error) {
    if (error instanceof TraewellingApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  // Some lines loop back to the same station more than once, so the boarding
  // stopover can only be identified by station id alone when that id occurs
  // exactly once; otherwise the departure time disambiguates which occurrence
  // was actually boarded.
  const isBoardingStation = (stopover: (typeof trip.stopovers)[number]) => String(stopover.station.id) === station;
  const boardingStationOccurrences = trip.stopovers.filter(isBoardingStation).length;

  const boardingIndex =
    boardingStationOccurrences === 1
      ? trip.stopovers.findIndex(isBoardingStation)
      : trip.stopovers.findLastIndex(
          (stopover) =>
            isBoardingStation(stopover)
            && !!time
            && formatTime(stopover.departurePlanned ?? stopover.departureReal ?? '') === time,
        );

  const remainingStopovers = boardingIndex >= 0 ? trip.stopovers.slice(boardingIndex + 1) : trip.stopovers;

  const boardingStopover = trip.stopovers[boardingIndex] ?? trip.stopovers[0];

  const modeColors = getColorsByMotisMode(trip.mode?.toUpperCase()) ?? [
    'var(--via-fg-primary)',
    'var(--via-bg-surface)',
  ];

  // const background = normalizeHexColor(trip.) ?? modeColors[0];

  return (
    <>
      <ColoredLayer color={modeColors[0]}>
        <ColoredLayer.Content>
          <h1>
            {trip.lineName} nach {cleanStationName(trip.destination.name)}
          </h1>
        </ColoredLayer.Content>
      </ColoredLayer>
      <TripStopoverList
        tripId={trip.tripId}
        lineName={trip.lineName}
        destinationName={trip.destination.name}
        startStation={boardingStopover}
        stopovers={remainingStopovers}
      />
    </>
  );
}

function TripStopoversSkeleton() {
  return (
    <>
      <Skeleton width="16rem" height="1.5rem" />
      <ul>
        {Array.from({ length: 10 }, (_, index) => (
          <li key={index}>
            <Skeleton width="100%" height="1.25rem" />
          </li>
        ))}
      </ul>
    </>
  );
}
