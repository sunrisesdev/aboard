import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatTime } from "@/helpers/formatTime";
import { requireSession } from "@/lib/auth";
import {
  createTraewellingClient,
  getTripInfo,
  TraewellingApiError,
} from "@/lib/traewelling";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { TripStopoverList, type StopoverSummary } from "./TripStopoverList";

export default async function TripPage({
  params,
  searchParams,
}: PageProps<"/trip/[tripId]">) {
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
  const isBoardingStation = (stopover: (typeof trip.stopovers)[number]) =>
    String(stopover.station.id) === station;
  const boardingStationOccurrences =
    trip.stopovers.filter(isBoardingStation).length;

  const boardingIndex =
    boardingStationOccurrences === 1
      ? trip.stopovers.findIndex(isBoardingStation)
      : trip.stopovers.findLastIndex(
          (stopover) =>
            isBoardingStation(stopover) &&
            !!time &&
            formatTime(
              stopover.departurePlanned ?? stopover.departureReal ?? "",
            ) === time,
        );

  const remainingStopovers =
    boardingIndex >= 0
      ? trip.stopovers.slice(boardingIndex + 1)
      : trip.stopovers;

  const boardingStopover = trip.stopovers[boardingIndex] ?? trip.stopovers[0];
  const stopoverSummaries: StopoverSummary[] = remainingStopovers.map(
    (stopover) => ({
      key: stopover.uuid ?? String(stopover.id),
      stationId: stopover.station.id,
      stationName: stopover.station.name,
      plannedAt: stopover.arrivalPlanned,
      actualAt: stopover.arrivalReal,
      cancelled: stopover.cancelled,
    }),
  );

  return (
    <>
      <h1>
        {trip.lineName} nach {trip.destination.name}
      </h1>
      <TripStopoverList
        tripId={trip.tripId}
        lineName={trip.lineName}
        destinationName={trip.destination.name}
        departure={{
          stationId: boardingStopover.station.id,
          stationName: boardingStopover.station.name,
          plannedAt: boardingStopover.departurePlanned,
          actualAt: boardingStopover.departureReal,
        }}
        stopovers={stopoverSummaries}
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
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder list, never reordered
          <li key={index}>
            <Skeleton width="100%" height="1.25rem" />
          </li>
        ))}
      </ul>
    </>
  );
}
