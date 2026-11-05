import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/Button/Button';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import { ButtonLink } from '@/components/ButtonLink/ButtonLink';
import { PageContent } from '@/components/PageContent/PageContent';
import { getPolylineCoordinates } from '@/components/RouteMap/getPolylineCoordinates';
import { getRouteMapStop } from '@/components/RouteMap/getRouteMapStop';
import { formatDateTime } from '@/helpers/dateTime';
import { JourneyHighlightProvider } from '@/journey/JourneyHighlight.context';
import { JourneyRouteMap } from '@/journey/JourneyRouteMap/JourneyRouteMap';
import { JourneyStats } from '@/journey/JourneyStats/JourneyStats';
import { JourneyTimeline } from '@/journey/JourneyTimeline/JourneyTimeline';
import { requireSession } from '@/lib/auth';
import { createTraewellingClient, getDailyStatistics, getStopovers, TraewellingApiError } from '@/lib/traewelling';
import { getCheckinColor } from '@/status/getCheckinColor';
import styles from './DailyStatistics.module.css';

// Only real calendar days in the format YYYY-MM-DD, e.g. no "2026-02-30"
function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().startsWith(value);
}

// Disabled without a date, so the other button keeps its place
const DayLink = ({
  date,
  direction,
  label,
}: {
  date?: string | null;
  direction: 'previous' | 'next';
  label: string;
}) => {
  const slots =
    direction === 'previous'
      ? { leadingSlot: <IconChevronLeft aria-hidden data-via-icon /> }
      : { trailingSlot: <IconChevronRight aria-hidden data-via-icon /> };

  return date ? (
    <ButtonLink aria-label={label} href={`/statistics/daily/${date}`} title={label} variant="secondary" {...slots}>
      {formatDateTime(date, 'shortDate')}
    </ButtonLink>
  ) : (
    <Button aria-label={label} disabled title={label} variant="secondary" {...slots} />
  );
};

export async function generateMetadata({ params }: PageProps<'/statistics/daily/[date]'>): Promise<Metadata> {
  const { date } = await params;

  return { title: isIsoDate(date) ? `Fahrten am ${formatDateTime(date, 'date')}` : undefined };
}

export default async function DailyStatisticsPage({ params }: PageProps<'/statistics/daily/[date]'>) {
  const { date } = await params;
  if (!isIsoDate(date)) notFound();

  const session = await requireSession();
  const client = createTraewellingClient(session.accessToken as string);

  const {
    nextDate,
    polylines,
    prevDate,
    statuses = [],
    totalDistance = 0,
    totalDuration = 0,
    totalPoints = 0,
  } = await getDailyStatistics(client, date).catch((error) => {
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
      <PageContent
        aside={
          <>
            <JourneyRouteMap routes={routes} />

            {statuses.length > 0 && (
              <JourneyStats
                distance={totalDistance}
                duration={totalDuration}
                points={totalPoints}
                pointsEnabled={session.user.pointsEnabled}
              />
            )}
          </>
        }
        header={
          <div className={styles.header}>
            <h1 className={styles.title}>Fahrten am {formatDateTime(date, 'date')}</h1>

            <ButtonGroup className={styles.dayNavigation}>
              <DayLink date={prevDate} direction="previous" label="Vorheriger Tag mit Fahrten" />
              <DayLink date={nextDate} direction="next" label="Nächster Tag mit Fahrten" />
            </ButtonGroup>
          </div>
        }
        stickyAside
      >
        {statuses.length === 0 ? (
          <p>Keine Fahrten an diesem Tag.</p>
        ) : (
          <JourneyTimeline statuses={statuses} stopoversByTrip={stopoversByTrip} />
        )}
      </PageContent>
    </JourneyHighlightProvider>
  );
}
