import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageContent } from '@/components/PageContent/PageContent';
import { getPolylineCoordinates } from '@/components/RouteMap/getPolylineCoordinates';
import { getRouteMapStop } from '@/components/RouteMap/getRouteMapStop';
import { formatDateTime } from '@/helpers/formatDateTime';
import { isIsoDate } from '@/helpers/isIsoDate';
import { JourneyHighlightProvider } from '@/journey/JourneyHighlight.context';
import { JourneyRouteMap } from '@/journey/JourneyRouteMap/JourneyRouteMap';
import { JourneyTimeline } from '@/journey/JourneyTimeline/JourneyTimeline';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDailyStatistics, getStopovers, TraewellingApiError } from '@/lib/traewelling';
import { getCheckinColor } from '@/status/getCheckinColor';

export async function generateMetadata({ params }: PageProps<'/statistics/daily/[date]'>): Promise<Metadata> {
  const { date } = await params;

  return { title: isIsoDate(date) ? `Fahrten am ${formatDateTime(date, 'date')}` : undefined };
}

export default async function DailyStatisticsPage({ params }: PageProps<'/statistics/daily/[date]'>) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const session = await requireSession();
  const client = createTraewellingClient(session.accessToken as string);

  const { polylines, statuses = [] } = await getDailyStatistics(client, date).catch((error) => {
    if (error instanceof TraewellingApiError && error.status === 400) notFound();

    throw error;
  });

  // Only needed for the directions, so the timeline is shown without them
  const stopoversByTrip =
    statuses.length > 0
      ? await getStopovers(
          client,
          statuses.map(({ checkin }) => checkin.trip),
        ).catch(() => undefined)
      : undefined;

  // All in one color, since overlapping trips would be hard to tell apart. A trip gets its own color once highlighted.
  const routes = statuses.map(({ checkin, id }) => {
    const polyline = polylines.find(({ properties }) => properties.statusId === id);

    return {
      color: 'var(--via-route-map-route)',
      highlightColor: getCheckinColor(checkin),
      statusId: id,
      // Falls back to a straight line when Träwelling has no polyline for this status
      coordinates: (polyline && getPolylineCoordinates(polyline)) ?? [
        getRouteMapStop(checkin.origin).coordinates,
        getRouteMapStop(checkin.destination).coordinates,
      ],
    };
  });

  return (
    <JourneyHighlightProvider>
      <PageContent aside={<JourneyRouteMap routes={routes} />} stickyAside>
        <h1>Fahrten am {formatDateTime(date, 'date')}</h1>

        {statuses.length === 0 ? (
          <p>Keine Fahrten an diesem Tag.</p>
        ) : (
          <JourneyTimeline statuses={statuses} stopoversByTrip={stopoversByTrip} />
        )}
      </PageContent>
    </JourneyHighlightProvider>
  );
}
