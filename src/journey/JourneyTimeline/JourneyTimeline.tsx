import { IconArrowRight } from '@tabler/icons-react';
import type { CSSProperties } from 'react';
import { Card } from '@/components/Card/Card';
import { Marquee } from '@/components/Marquee/Marquee';
import { SubtleTintedSurface } from '@/components/TintedSurface/SubtleTintedSurface';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import { getLineColors } from '@/helpers/getLineColors';
import type { StatusResource, StopoverResource } from '@/lib/traewelling';
import { getCheckinColor } from '@/status/getCheckinColor';
import { getCheckinMode } from '@/status/getCheckinMode';
import { getCheckinStopovers } from '@/status/getCheckinStopovers';
import { StatusBody } from '@/status/StatusBody/StatusBody';
import { StatusTripHeader } from '@/status/StatusTripHeader/StatusTripHeader';
import { getJourneyTimeline, type JourneyTimelineStop } from '../getJourneyTimeline';
import styles from './JourneyTimeline.module.css';

const transferColor = 'var(--via-fg-placeholder)';

// `real` includes manual times entered by the user, like getCheckinTimes. The delay is shown above an arrival and
// below a departure, so it stays clear of the other time at a shared stop.
const JourneyTime = ({
  kind,
  label,
  planned,
  real,
}: {
  kind: 'arrival' | 'departure';
  label?: string;
  planned: string | null;
  real: string | null;
}) => {
  const time = real ?? planned;
  if (!time) return null;

  const delay = planned ? getDelay(planned, time) : undefined;

  return (
    <div className={styles.timeRow}>
      {label && <span className={styles.timeLabel}>{label}</span>}
      <span className={styles.time}>
        <time dateTime={time}>{formatDateTime(time, 'time')}</time>
        {!!delay?.minutes && (
          <span className={styles.delayBadge} data-via-delay={delay.status} data-via-kind={kind}>
            {formatDelay(delay.minutes)}
          </span>
        )}
      </span>
    </div>
  );
};

// A segment of the line, solid in the trip's color or dotted for a short transfer
const JourneyLineSegment = ({ status, transfer }: { status?: StatusResource; transfer?: boolean }) => {
  if (status)
    return <TripLine.RouteSegment className={styles.route} style={{ color: getCheckinColor(status.checkin) }} />;
  if (transfer)
    return <TripLine.RouteSegment className={styles.transferRoute} partial style={{ color: transferColor }} />;

  return <div className={styles.spacer} />;
};

const JourneyStop = ({ arrival, departure, shortTransferAfter, shortTransferBefore, station }: JourneyTimelineStop) => {
  const arrivalStopover = arrival?.checkin.destination;
  const departureStopover = departure?.checkin.origin;
  const isShared = !!arrival && !!departure;

  const formatPlatforms = (abbreviate: boolean) => [
    arrivalStopover
      && formatPlatform(
        arrivalStopover.arrivalPlatformReal ?? arrivalStopover.arrivalPlatformPlanned,
        arrival && getCheckinMode(arrival.checkin),
        { abbreviate, planned: arrivalStopover.arrivalPlatformPlanned },
      ),
    departureStopover
      && formatPlatform(
        departureStopover.departurePlatformReal ?? departureStopover.departurePlatformPlanned,
        departure && getCheckinMode(departure.checkin),
        { abbreviate, planned: departureStopover.departurePlatformPlanned },
      ),
  ];
  const [arrivalPlatform, departurePlatform] = formatPlatforms(false);
  // Only abbreviated when both platforms have to fit next to each other
  const [abbreviatedArrivalPlatform, abbreviatedDeparturePlatform] =
    arrivalPlatform && departurePlatform && arrivalPlatform !== departurePlatform ? formatPlatforms(true) : [];
  const platform = abbreviatedArrivalPlatform ? (
    <>
      {abbreviatedArrivalPlatform}
      <IconArrowRight data-via-icon />
      {abbreviatedDeparturePlatform}
    </>
  ) : (
    (departurePlatform ?? arrivalPlatform)
  );

  const stopColors = {
    '--via-journey-arrival-color': arrival && getCheckinColor(arrival.checkin),
    '--via-journey-departure-color': departure && getCheckinColor(departure.checkin),
  } as CSSProperties;

  return (
    <li className={styles.stop}>
      <div className={styles.times}>
        {arrival && arrivalStopover && (
          <JourneyTime
            kind="arrival"
            label={isShared ? 'an' : undefined}
            planned={arrivalStopover.arrivalPlanned}
            real={arrival.checkin.manualArrival ?? arrivalStopover.arrivalReal}
          />
        )}
        {departure && departureStopover && (
          <JourneyTime
            kind="departure"
            label={isShared ? 'ab' : undefined}
            planned={departureStopover.departurePlanned}
            real={departure.checkin.manualDeparture ?? departureStopover.departureReal}
          />
        )}
      </div>

      <TripLine className={styles.line}>
        <JourneyLineSegment status={arrival} transfer={shortTransferBefore} />
        <TripLine.StopIndicator
          className={styles.stopIndicator}
          data-via-shared={isShared || undefined}
          style={stopColors}
        />
        <JourneyLineSegment status={departure} transfer={shortTransferAfter} />
      </TripLine>

      <div className={styles.station}>
        <Marquee>{cleanStationName(station.name)}</Marquee>
        {platform && <span className={styles.platformBadge}>{platform}</span>}
      </div>
    </li>
  );
};

// The direction is only known from the trip's stopovers
const JourneyTrip = ({ status, stopovers }: { status: StatusResource; stopovers?: StopoverResource[] }) => {
  const { bodyMentions, checkin } = status;
  const body = typeof status.body === 'string' ? status.body : undefined;

  return (
    <li className={styles.trip}>
      <TripLine className={styles.line}>
        <JourneyLineSegment status={status} />
      </TripLine>

      <div className={styles.details}>
        <SubtleTintedSurface
          className={styles.tripSurface}
          color={getLineColors({ color: checkin.routeColor, mode: getCheckinMode(checkin) }).background}
          radius="0.75rem"
        >
          <SubtleTintedSurface.Content className={styles.tripContent}>
            <StatusTripHeader
              checkin={checkin}
              direction={stopovers && getCheckinStopovers(stopovers, checkin).direction}
            />
            {body && <StatusBody body={body} className={styles.body} mentions={bodyMentions} paragraphs />}
          </SubtleTintedSurface.Content>
        </SubtleTintedSurface>
      </div>
    </li>
  );
};

/**
 * All trips of a day as one line: trips continuing at the same station within an hour share their stop, other
 * transfers within an hour are connected by a dotted line and longer ones are separated by a divider.
 */
export const JourneyTimeline = ({
  statuses,
  stopoversByTrip,
}: {
  statuses: StatusResource[];
  stopoversByTrip?: Record<string, StopoverResource[]>;
}) => {
  return (
    <Card>
      <ol className={styles.base}>
        {getJourneyTimeline(statuses).map((item, index) => {
          if (item.type === 'stop') return <JourneyStop key={index} {...item} />;
          if (item.type === 'trip') {
            return (
              <JourneyTrip key={index} status={item.status} stopovers={stopoversByTrip?.[item.status.checkin.trip]} />
            );
          }

          return (
            <li aria-hidden className={styles.transfer} data-via-short={item.short || undefined} key={index}>
              {item.short && (
                <TripLine className={styles.line}>
                  <JourneyLineSegment transfer />
                </TripLine>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
};
