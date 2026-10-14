'use client';

import Link from 'next/link';
import { use } from 'react';
import { Marquee } from '@/components/Marquee/Marquee';
import { TintedSurface } from '@/components/TintedSurface/TintedSurface';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import { getLineColors } from '@/helpers/getLineColors';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { getNextStopover } from '@/status/getNextStopover';
import { StatusTripHeader } from '@/status/StatusTripHeader/StatusTripHeader';
import { useCurrentStatuses } from '@/status/useCurrentStatuses';
import styles from './ActiveStatus.module.css';

// Only shows where the trip goes next: the boarding station before departure, the next stop while it's running and
// the station to get off at
export const ActiveStatus = ({ className }: { className?: string }) => {
  const { active, activeStopovers, next } = use(useCurrentStatuses().currentStatusesPromise);

  if (!active) return null;

  const { checkin } = active;
  const { destination, origin } = checkin;
  const { arrival, departure } = getCheckinTimes(checkin);

  // Only updates with each refresh of the current statuses, which happens at least once a minute
  const now = new Date();
  const isBeforeDeparture = !!departure && now < new Date(departure);
  const nextStopover = activeStopovers && getNextStopover(activeStopovers.stopovers, checkin, now);

  // The destination is shown anyway
  const nextStation =
    nextStopover && nextStopover !== activeStopovers?.stopovers.at(-1)
      ? {
          label: 'Nächster Halt',
          planned: nextStopover.arrivalPlanned,
          plannedPlatform: nextStopover.arrivalPlatformPlanned,
          platform: nextStopover.arrivalPlatformReal ?? nextStopover.arrivalPlatformPlanned,
          real: nextStopover.arrivalReal,
          station: nextStopover.station,
          timePrefix: 'an',
        }
      : isBeforeDeparture
        ? {
            label: 'Einstieg',
            planned: origin.departurePlanned,
            plannedPlatform: origin.departurePlatformPlanned,
            platform: origin.departurePlatformReal ?? origin.departurePlatformPlanned,
            real: origin.departureReal,
            station: origin.station,
            timePrefix: 'ab',
          }
        : undefined;

  const nextStationTime = nextStation && (nextStation.real ?? nextStation.planned);
  const nextStationDelay = nextStation?.planned ? getDelay(nextStation.planned, nextStation.real) : undefined;
  const nextStationPlatform =
    nextStation && formatPlatform(nextStation.platform, checkin.mode, { planned: nextStation.plannedPlatform });

  const destinationTime = destination.arrivalReal ?? destination.arrivalPlanned;
  const destinationDelay = destination.arrivalPlanned
    ? getDelay(destination.arrivalPlanned, destination.arrivalReal)
    : undefined;
  const destinationPlatform = formatPlatform(
    destination.arrivalPlatformReal ?? destination.arrivalPlatformPlanned,
    checkin.mode,
    { planned: destination.arrivalPlatformPlanned },
  );

  // Fills up by CSS animation like the line in StatusTrip, so it keeps progressing without re-rendering
  const progressStyle =
    arrival && departure
      ? {
          animationDelay: `${new Date(departure).getTime() - now.getTime()}ms`,
          animationDuration: `${new Date(arrival).getTime() - new Date(departure).getTime()}ms`,
        }
      : undefined;

  return (
    <TintedSurface
      className={className}
      color={getLineColors({ color: checkin.routeColor, mode: checkin.mode }).background}
      radius="1rem"
    >
      <TintedSurface.Content>
        <Link className={styles.link} href={`/status/${active.id}`}>
          <StatusTripHeader checkin={checkin} className={styles.header} direction={activeStopovers?.direction} />

          <div className={styles.trip}>
            <TripLine className={styles.tripLine}>
              {/* Hints at the part of the trip that's already behind */}
              {!isBeforeDeparture && (
                <TripLine.RouteSegment
                  className={styles.previousSegment}
                  style={{ gridRowEnd: nextStation ? 'nextStop-end' : 'destinationStop-end' }}
                />
              )}

              {nextStation && (
                <TripLine.StopIndicator className={styles.stopIndicator} style={{ gridArea: 'nextStop' }} />
              )}
              {nextStation && <TripLine.RouteSegment className={styles.upcomingSegment} partial />}

              <TripLine.StopIndicator className={styles.stopIndicator} style={{ gridArea: 'destinationStop' }} />
            </TripLine>

            {nextStation && (
              <>
                <em className={styles.label} style={{ gridArea: 'nextLabel' }}>
                  {nextStation.label}
                </em>

                <div className={styles.nextStation}>
                  <Marquee>{cleanStationName(nextStation.station.name)}</Marquee>

                  {!!nextStationDelay?.minutes && (
                    <span className={styles.delayBadge} data-via-delay={nextStationDelay.status}>
                      {formatDelay(nextStationDelay.minutes)}
                    </span>
                  )}

                  {nextStationTime && (
                    <span className={styles.time}>
                      {nextStation.timePrefix} {formatDateTime(nextStationTime, 'time')}
                    </span>
                  )}
                </div>

                {nextStationPlatform && <div className={styles.nextDetails}>{nextStationPlatform}</div>}
              </>
            )}

            <em className={styles.label} style={{ gridArea: 'destinationLabel' }}>
              Ausstieg
            </em>

            <div className={styles.destinationStation}>
              <Marquee>{cleanStationName(destination.station.name)}</Marquee>
              {destinationTime && <span className={styles.time}>an {formatDateTime(destinationTime, 'time')}</span>}
            </div>

            {(destination.cancelled || destinationPlatform || !!destinationDelay?.minutes) && (
              <div className={styles.destinationDetails}>
                {destination.cancelled && <span className={styles.cancelledBadge}>Halt entfällt</span>}
                {destinationPlatform && <span className={styles.platformBadge}>{destinationPlatform}</span>}

                {destination.arrivalPlanned && !!destinationDelay?.minutes && (
                  <span className={styles.delayBadge} data-via-delay={destinationDelay.status}>
                    {formatDelay(destinationDelay.minutes, { planned: destination.arrivalPlanned })}
                  </span>
                )}
              </div>
            )}
          </div>

          {next && (
            <div className={styles.next}>
              Danach: {cleanStationName(next.checkin.origin.station.name)} →{' '}
              {cleanStationName(next.checkin.destination.station.name)}
            </div>
          )}

          {progressStyle && (
            <div className={styles.progressBar}>
              {/* The server renders with a slightly earlier `now` */}
              <div className={styles.progress} style={progressStyle} suppressHydrationWarning />
            </div>
          )}
        </Link>
      </TintedSurface.Content>
    </TintedSurface>
  );
};
