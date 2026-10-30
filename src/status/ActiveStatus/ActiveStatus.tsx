'use client';

import { IconAlertTriangleFilled, IconSwitchHorizontal } from '@tabler/icons-react';
import { clsx } from 'clsx';
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
import type { StatusResource, StopoverResource } from '@/lib/traewelling';
import { getCheckinMode } from '@/status/getCheckinMode';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { getNextStopover } from '@/status/getNextStopover';
import { StatusTripHeader } from '@/status/StatusTripHeader/StatusTripHeader';
import { useCurrentStatuses } from '@/status/useCurrentStatuses';
import styles from './ActiveStatus.module.css';

type Station = {
  cancelled?: boolean;
  label: string;
  planned: string | null;
  plannedPlatform: string | null;
  platform: string | null;
  real: string | null;
  station: StopoverResource['station'];
  timePrefix: string;
};

function getArrivalStation(stopover: StopoverResource, label: string): Station {
  return {
    cancelled: stopover.cancelled,
    label,
    planned: stopover.arrivalPlanned,
    plannedPlatform: stopover.arrivalPlatformPlanned,
    platform: stopover.arrivalPlatformReal ?? stopover.arrivalPlatformPlanned,
    real: stopover.arrivalReal,
    station: stopover.station,
    timePrefix: 'an',
  };
}

function getStationDetails(
  { planned, plannedPlatform, platform, real }: Station,
  mode: string | undefined,
  abbreviate = false,
) {
  return {
    delay: planned ? getDelay(planned, real) : undefined,
    platform: formatPlatform(platform, mode, { abbreviate, planned: plannedPlatform }),
    time: real ?? planned,
  };
}

// The compact variant has no details row: the platform follows the name and the delay precedes the time
const StationRow = ({
  compact,
  detailsClassName,
  mode,
  rowClassName,
  station,
}: {
  compact: boolean;
  detailsClassName: string;
  mode: string | undefined;
  rowClassName: string;
  station: Station;
}) => {
  const { delay, platform, time } = getStationDetails(station, mode, compact);

  return (
    <>
      <div className={clsx(styles.stationRow, rowClassName)}>
        <Marquee>{cleanStationName(station.station.name)}</Marquee>
        {compact && station.cancelled && <span className={styles.cancelledBadge}>entfällt</span>}
        {compact && platform && <span className={styles.platformBadge}>{platform}</span>}

        <span className={styles.timing}>
          {compact && !!delay?.minutes && (
            <span className={styles.delayBadge} data-via-delay={delay.status}>
              {formatDelay(delay.minutes)}
            </span>
          )}

          {time && (
            <span className={styles.time}>
              {station.timePrefix} {formatDateTime(time, 'time')}
            </span>
          )}
        </span>
      </div>

      {!compact && (station.cancelled || platform || !!delay?.minutes) && (
        <div className={detailsClassName}>
          {station.cancelled && <span className={styles.cancelledBadge}>Halt entfällt</span>}
          {platform && <span className={styles.platformBadge}>{platform}</span>}

          {station.planned && !!delay?.minutes && (
            <span className={styles.delayBadge} data-via-delay={delay.status}>
              {formatDelay(delay.minutes, { planned: station.planned })}
            </span>
          )}
        </div>
      )}
    </>
  );
};

// How long before the arrival only the destination is shown, as long as there's no stop left in between
const alightingWindow = 10 * 60 * 1000;

// Before departure only the boarding station is shown and shortly before arriving only the destination. In between
// it's the next stop (if there's one left before the destination) and the destination, plus the trip's progress.
export const ActiveStatus = ({ className, compact = false }: { className?: string; compact?: boolean }) => {
  const {
    active,
    activeStopovers,
    next,
    nextStopovers,
    timeOffset = 0,
  } = use(useCurrentStatuses().currentStatusesPromise);

  if (!active) return null;

  const { checkin } = active;
  const { destination, origin } = checkin;
  const mode = getCheckinMode(checkin);
  const { arrival, departure } = getCheckinTimes(checkin);

  // Only updates with each refresh of the current statuses, which happens at least once a minute
  const now = new Date(Date.now() + timeOffset);
  const nextStopover = activeStopovers && getNextStopover(activeStopovers.stopovers, checkin, now);

  // Manual times entered by the user take precedence over live data, like in getCheckinTimes
  const boardingStation: Station = {
    cancelled: origin.cancelled,
    label: 'Einstieg',
    planned: origin.departurePlanned,
    plannedPlatform: origin.departurePlatformPlanned,
    platform: origin.departurePlatformReal ?? origin.departurePlatformPlanned,
    real: checkin.manualDeparture ?? origin.departureReal,
    station: origin.station,
    timePrefix: 'ab',
  };
  const destinationStation: Station = {
    ...getArrivalStation(destination, 'Ausstieg'),
    real: checkin.manualArrival ?? destination.arrivalReal,
  };
  const nextStation =
    nextStopover && nextStopover !== activeStopovers?.stopovers.at(-1)
      ? getArrivalStation(nextStopover, 'Nächster Halt')
      : undefined;

  const isBoarding = !!departure && now < new Date(departure);
  const isAlighting =
    !isBoarding && !nextStation && !!arrival && Date.parse(arrival) - now.getTime() <= alightingWindow;
  const isEnRoute = !isBoarding && !isAlighting;

  // Hardly matters anymore when getting off, and the compact variant leaves it out while the trip is running, so the
  // line can run into the top of the card instead
  const showsHeader = !isAlighting && !(compact && isEnRoute);

  const nextDeparture = next && getCheckinTimes(next.checkin).departure;
  // Worth mentioning when the next status doesn't depart where this one arrives
  const changesStation = !!next && next.checkin.origin.station.id !== destination.station.id;

  return (
    <div className={clsx(styles.base, compact && styles.isCompact, className)}>
      {/* The compact variant stacks the next status behind this one, so both float as one */}
      <TintedSurface
        className={styles.activeSurface}
        color={getLineColors({ color: checkin.routeColor, mode }).background}
        radius="1rem"
      >
        <TintedSurface.Content>
          <Link className={styles.link} href={`/status/${active.id}`}>
            {showsHeader && (
              <StatusTripHeader checkin={checkin} className={styles.header} direction={activeStopovers?.direction} />
            )}

            {!isEnRoute ? (
              <SingleStation
                compact={compact}
                mode={mode}
                station={isBoarding ? boardingStation : destinationStation}
                variant={isBoarding ? 'boarding' : 'alighting'}
              />
            ) : (
              <EnRoute
                arrival={arrival}
                compact={compact}
                departure={departure}
                destination={destinationStation}
                mode={mode}
                next={nextStation}
                now={now}
              />
            )}
          </Link>
        </TintedSurface.Content>
      </TintedSurface>

      {!compact && arrival && nextDeparture && (
        <Transfer arrival={arrival} changesStation={changesStation} departure={nextDeparture} />
      )}

      {next && (
        <NextStatus
          changesStation={changesStation}
          compact={compact}
          direction={nextStopovers?.direction}
          status={next}
        />
      )}
    </div>
  );
};

// Runs from one card to the other, next to the time left for the transfer
const Transfer = ({
  arrival,
  changesStation,
  departure,
}: {
  arrival: string;
  changesStation: boolean;
  departure: string;
}) => {
  const minutes = Math.round((Date.parse(departure) - Date.parse(arrival)) / 60_000);

  return (
    <div className={styles.transfer}>
      <div className={styles.transferLine} />

      {minutes >= 0 ? (
        <span>
          <IconSwitchHorizontal
            data-via-icon
            style={{ fontSize: '1rem', marginRight: '1ch', verticalAlign: 'central' }}
          />
          <strong>
            {minutes} {minutes === 1 ? 'Minute' : 'Minuten'}
          </strong>
          , um {changesStation ? 'die Station zu wechseln' : 'umzusteigen'}
        </span>
      ) : (
        <span style={{ color: 'var(--via-fg-error)', fontWeight: 500 }}>
          <IconAlertTriangleFilled
            data-via-icon
            style={{ fontSize: '1rem', marginRight: '1ch', verticalAlign: 'central' }}
          />
          Anschluss wahrscheinlich nicht erreichbar
        </span>
      )}
    </div>
  );
};

// The status following the active one, with what's needed to catch it: where, which way and when it departs
const NextStatus = ({
  changesStation,
  compact,
  direction,
  status,
}: {
  changesStation: boolean;
  compact: boolean;
  direction?: StopoverResource;
  status: StatusResource;
}) => {
  const { checkin } = status;
  const { origin } = checkin;
  const mode = getCheckinMode(checkin);
  const { departure } = getCheckinTimes(checkin);
  const delay = origin.departurePlanned ? getDelay(origin.departurePlanned, departure) : undefined;
  const platform = formatPlatform(origin.departurePlatformReal ?? origin.departurePlatformPlanned, mode, {
    abbreviate: compact,
    planned: origin.departurePlatformPlanned,
  });

  const departureDetails = (
    <>
      <div className={styles.nextDirection}>
        {/* Without the stopovers the trip's direction is unknown, so it falls back to the alighting station */}
        <span className={styles.direction}>
          {direction ? (compact ? 'Ri.' : 'Richtung') : 'nach'}{' '}
          <Marquee>{cleanStationName((direction ?? checkin.destination).station.name)}</Marquee>
        </span>

        {platform && <span className={styles.platformBadge}>{platform}</span>}
      </div>

      <span className={styles.timing}>
        {!!delay?.minutes && (
          <span className={styles.delayBadge} data-via-delay={delay.status}>
            {formatDelay(delay.minutes)}
          </span>
        )}

        {departure && <span className={styles.nextTime}>ab {formatDateTime(departure, 'time')}</span>}
      </span>
    </>
  );

  // The station to change to takes the place next to the line badge, pushing the departure into a row of its own
  return (
    <TintedSurface
      className={styles.nextSurface}
      color={getLineColors({ color: checkin.routeColor, mode }).background}
      // Set in from the wider active status in front of it
      radius={compact ? '0.75rem' : '1rem'}
    >
      <TintedSurface.Content>
        <Link className={clsx(styles.link, styles.nextLink)} href={`/status/${status.id}`}>
          <StatusTripHeader checkin={checkin}>
            {changesStation ? (
              <em className={clsx(styles.label, styles.nextOrigin)}>
                <Marquee>Weiterfahrt ab {cleanStationName(origin.station.name)}</Marquee>
              </em>
            ) : (
              departureDetails
            )}
          </StatusTripHeader>

          {changesStation && <div className={styles.nextDeparture}>{departureDetails}</div>}
        </Link>
      </TintedSurface.Content>
    </TintedSurface>
  );
};

// The line continues below the boarding station, where the trip is still ahead, and comes in from above the
// destination
const SingleStation = ({
  compact,
  mode,
  station,
  variant,
}: {
  compact: boolean;
  mode: string | undefined;
  station: Station;
  variant: 'alighting' | 'boarding';
}) => {
  return (
    <div className={styles.single}>
      <TripLine className={styles.tripLine}>
        {variant === 'boarding' ? (
          <TripLine.RouteSegment className={styles.followingSegment} partial />
        ) : (
          <TripLine.RouteSegment className={styles.previousSegment} />
        )}
        <TripLine.StopIndicator active className={styles.stopIndicator} style={{ gridArea: 'stop' }} />
      </TripLine>

      <em className={styles.label} style={{ gridArea: 'label' }}>
        {station.label}
      </em>

      <StationRow
        compact={compact}
        detailsClassName={styles.singleDetails}
        mode={mode}
        rowClassName={styles.singleStation}
        station={station}
      />
    </div>
  );
};

const EnRoute = ({
  arrival,
  compact,
  departure,
  destination,
  mode,
  next,
  now,
}: {
  arrival: string | null;
  compact: boolean;
  departure: string | null;
  destination: Station;
  mode: string | undefined;
  next?: Station;
  now: Date;
}) => {
  const nextDetails = next && getStationDetails(next, mode);
  // Kept subtle without the planned platform
  const nextPlatform = next && formatPlatform(next.platform, mode, { abbreviate: compact });

  return (
    <>
      <div className={clsx(styles.trip, compact && styles.isCompact)}>
        <TripLine className={styles.tripLine}>
          {/* Hints at the part of the trip that's already behind */}
          <TripLine.RouteSegment
            className={styles.previousSegment}
            style={{ gridRowEnd: next ? 'nextStop-end' : 'destinationStop-end' }}
          />

          {/* The stop the vehicle is heading to, which is the destination once there's none left in between */}
          {next && <TripLine.StopIndicator active className={styles.stopIndicator} style={{ gridArea: 'nextStop' }} />}
          {next && <TripLine.RouteSegment className={styles.upcomingSegment} partial />}

          <TripLine.StopIndicator
            active={!next}
            className={styles.stopIndicator}
            style={{ gridArea: 'destinationStop' }}
          />
        </TripLine>

        {next && nextDetails && (
          <>
            {!compact && (
              <em className={styles.label} style={{ gridArea: 'nextLabel' }}>
                {next.label}
              </em>
            )}

            <div className={styles.nextStation}>
              <Marquee>
                {cleanStationName(next.station.name)}
                {nextPlatform && `, ${nextPlatform}`}
              </Marquee>

              {!!nextDetails.delay?.minutes && (
                <span className={styles.delayBadge} data-via-delay={nextDetails.delay.status}>
                  {formatDelay(nextDetails.delay.minutes)}
                </span>
              )}

              {nextDetails.time && (
                <span className={styles.time}>
                  {next.timePrefix} {formatDateTime(nextDetails.time, 'time')}
                </span>
              )}
            </div>
          </>
        )}

        {/* Left out by the compact variant, the label rows then collapse */}
        {!compact && (
          <em className={styles.label} style={{ gridArea: 'destinationLabel' }}>
            {destination.label}
          </em>
        )}

        <StationRow
          compact={compact}
          detailsClassName={styles.destinationDetails}
          mode={mode}
          rowClassName={styles.destinationStation}
          station={destination}
        />
      </div>

      {!compact && <ProgressBar arrival={arrival} departure={departure} now={now} />}
    </>
  );
};

// Fills up by CSS animation like the line in StatusTrip, so it keeps progressing without re-rendering
const ProgressBar = ({ arrival, departure, now }: { arrival: string | null; departure: string | null; now: Date }) => {
  if (!arrival || !departure) return null;

  const progressStyle = {
    animationDelay: `${new Date(departure).getTime() - now.getTime()}ms`,
    animationDuration: `${new Date(arrival).getTime() - new Date(departure).getTime()}ms`,
  };

  return (
    <div className={styles.progressBar}>
      {/* The server renders with a slightly earlier `now` */}
      <div className={styles.progress} style={progressStyle} suppressHydrationWarning />
    </div>
  );
};
