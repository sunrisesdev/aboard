import { Marquee } from '@/components/Marquee/Marquee';
import { TintedSurface } from '@/components/TintedSurface/TintedSurface';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatDistance } from '@/helpers/formatDistance';
import { formatDuration } from '@/helpers/formatDuration';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import { getLineColors } from '@/helpers/getLineColors';
import type { components } from '@/lib/traewelling/schema';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { StatusTripHeader } from '@/status/StatusTripHeader/StatusTripHeader';
import styles from './StatusTrip.module.css';

type Stopover = components['schemas']['StopoverResource'];

// Renders into the grid areas of StatusTrip, so the stop indicators line up with the station names. `real` includes
// manual times entered by the user, like getCheckinTimes.
const StatusTripStation = ({
  area,
  cancelled,
  label,
  mode,
  planned,
  plannedPlatform,
  platform,
  real,
  station,
  timePrefix,
}: {
  area: 'destination' | 'origin';
  cancelled?: boolean;
  label: string;
  mode: string | null;
  planned: string | null;
  plannedPlatform: string | null;
  platform: string | null;
  real: string | null;
  station: Stopover['station'];
  timePrefix: string;
}) => {
  const formattedPlatform = formatPlatform(platform, mode, { planned: plannedPlatform });
  const delay = planned ? getDelay(planned, real) : undefined;
  const time = real ?? planned;

  return (
    <>
      <em className={styles.label} style={{ gridArea: `${area}Label` }}>
        {label}
      </em>

      <div className={styles.station} style={{ gridArea: `${area}Station` }}>
        <Marquee>{cleanStationName(station.name)}</Marquee>
        {time && (
          <span className={styles.time}>
            {timePrefix} {formatDateTime(time, 'time')}
          </span>
        )}
      </div>

      {(cancelled || formattedPlatform || (delay && delay.minutes !== 0)) && (
        <div className={styles.details} style={{ gridArea: `${area}Details` }}>
          {cancelled && <span className={styles.cancelledBadge}>Halt entfällt</span>}
          {formattedPlatform && <span className={styles.platformBadge}>{formattedPlatform}</span>}

          {planned && delay && delay.minutes !== 0 && (
            <span className={styles.delayBadge} data-via-delay={delay.status}>
              {formatDelay(delay.minutes, { planned })}
            </span>
          )}
        </div>
      )}
    </>
  );
};

/**
 * @param stopovers Stopovers of the checked-in section, including origin and destination.
 * @param nextStopover Only set while the trip is ongoing.
 */
export const StatusTrip = ({
  checkin,
  direction,
  nextStopover,
  now,
  stopovers,
}: {
  checkin: components['schemas']['TransportResource'];
  direction?: Stopover;
  nextStopover?: Stopover;
  now: Date;
  stopovers?: Stopover[];
}) => {
  const { destination, origin } = checkin;
  const { arrival, departure } = getCheckinTimes(checkin);

  // The line fills up by CSS animation, so it keeps progressing without re-rendering. A negative delay
  // starts it partway through, a positive one (before departure) keeps it empty until then.
  const progressStyle =
    arrival && departure && now < new Date(arrival)
      ? {
          animationDelay: `${new Date(departure).getTime() - now.getTime()}ms`,
          animationDuration: `${new Date(arrival).getTime() - new Date(departure).getTime()}ms`,
        }
      : undefined;

  const intermediateCount = stopovers?.slice(1, -1).filter(({ cancelled }) => !cancelled).length;

  // The destination is shown below anyway
  const isNextStopoverIntermediate = !!nextStopover && nextStopover !== stopovers?.at(-1);
  const nextStopoverTime =
    nextStopover
    && (nextStopover.arrivalReal
      ?? nextStopover.arrivalPlanned
      ?? nextStopover.departureReal
      ?? nextStopover.departurePlanned);

  const durationInHours =
    arrival && departure ? (new Date(arrival).getTime() - new Date(departure).getTime()) / 3_600_000 : undefined;
  const distanceInKilometers = checkin.distance / 1000;

  return (
    <TintedSurface color={getLineColors({ color: checkin.routeColor, mode: checkin.mode }).background} radius="1rem">
      <TintedSurface.Content className={styles.base}>
        <StatusTripHeader checkin={checkin} className={styles.header} direction={direction} />

        <div className={styles.trip}>
          <TripLine className={styles.tripLine}>
            <TripLine.RouteSegment className={styles.routeSegment} partial={!!progressStyle} />
            {progressStyle && <div className={styles.progress} style={progressStyle} />}
            <TripLine.StopIndicator className={styles.stopIndicator} style={{ gridArea: 'originStop' }} />
            <TripLine.StopIndicator className={styles.stopIndicator} style={{ gridArea: 'destinationStop' }} />
          </TripLine>

          <StatusTripStation
            area="origin"
            cancelled={origin.cancelled}
            label="von"
            mode={checkin.mode}
            planned={origin.departurePlanned}
            plannedPlatform={origin.departurePlatformPlanned}
            platform={origin.departurePlatformReal ?? origin.departurePlatformPlanned}
            real={checkin.manualDeparture ?? origin.departureReal}
            station={origin.station}
            timePrefix="ab"
          />

          <div className={styles.intermediateStops}>
            {intermediateCount !== undefined && (
              <span>
                {intermediateCount === 0
                  ? 'Ohne Zwischenhalt'
                  : `${intermediateCount} ${intermediateCount === 1 ? 'Zwischenhalt' : 'Zwischenhalte'}`}
              </span>
            )}

            {nextStopover && isNextStopoverIntermediate && (
              <span>
                Nächster Halt: {cleanStationName(nextStopover.station.name)}
                {nextStopoverTime && (
                  <>
                    {' um '}
                    <time dateTime={nextStopoverTime}>{formatDateTime(nextStopoverTime, 'time')}</time>
                  </>
                )}
              </span>
            )}
          </div>

          <StatusTripStation
            area="destination"
            cancelled={destination.cancelled}
            label="nach"
            mode={checkin.mode}
            planned={destination.arrivalPlanned}
            plannedPlatform={destination.arrivalPlatformPlanned}
            platform={destination.arrivalPlatformReal ?? destination.arrivalPlatformPlanned}
            real={checkin.manualArrival ?? destination.arrivalReal}
            station={destination.station}
            timePrefix="an"
          />
        </div>

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Entfernung</dt>
            <dd>{formatDistance(checkin.distance)}</dd>
          </div>

          <div className={styles.stat}>
            <dt>Dauer</dt>
            <dd>{arrival && departure ? formatDuration(departure, arrival) : '–'}</dd>
          </div>

          <div className={styles.stat}>
            <dt>Ø Tempo</dt>
            <dd>
              {durationInHours
                ? `${Math.round(distanceInKilometers / durationInHours).toLocaleString('de-DE')} km/h`
                : '–'}
            </dd>
          </div>
        </dl>
      </TintedSurface.Content>
    </TintedSurface>
  );
};
