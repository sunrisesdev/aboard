import type { CSSProperties } from 'react';
import { Card } from '@/components/Card/Card';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import type { MotisMode, StatusResource } from '@/lib/traewelling';
import { getCheckinColor } from '@/status/getCheckinColor';
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
  if (status) return <TripLine.RouteSegment style={{ color: getCheckinColor(status.checkin) }} />;
  if (transfer) return <TripLine.RouteSegment partial style={{ color: transferColor }} />;

  return <div className={styles.spacer} />;
};

const JourneyStop = ({ arrival, departure, shortTransferAfter, shortTransferBefore, station }: JourneyTimelineStop) => {
  const arrivalStopover = arrival?.checkin.destination;
  const departureStopover = departure?.checkin.origin;
  const isShared = !!arrival && !!departure;

  const arrivalPlatform =
    arrivalStopover
    && formatPlatform(
      arrivalStopover.arrivalPlatformReal ?? arrivalStopover.arrivalPlatformPlanned,
      arrival?.checkin.mode,
      { abbreviate: isShared, planned: arrivalStopover.arrivalPlatformPlanned },
    );
  const departurePlatform =
    departureStopover
    && formatPlatform(
      departureStopover.departurePlatformReal ?? departureStopover.departurePlatformPlanned,
      departure?.checkin.mode,
      { abbreviate: isShared, planned: departureStopover.departurePlatformPlanned },
    );
  const platform =
    arrivalPlatform && departurePlatform && arrivalPlatform !== departurePlatform
      ? `${arrivalPlatform} → ${departurePlatform}`
      : (departurePlatform ?? arrivalPlatform);

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

const JourneyTrip = ({ status }: { status: StatusResource }) => {
  const { checkin } = status;

  return (
    <li className={styles.trip}>
      <TripLine className={styles.line}>
        <JourneyLineSegment status={status} />
      </TripLine>

      <div className={styles.details}>
        <LineBadge
          backgroundColor={checkin.routeColor ?? undefined}
          color={checkin.routeTextColor ?? undefined}
          journeyNumber={checkin.manualJourneyNumber ?? checkin.journeyNumber?.toString()}
          mode={(checkin.mode ?? undefined) as MotisMode | undefined}
          name={checkin.lineName}
          productName={undefined}
        />
      </div>
    </li>
  );
};

/**
 * All trips of a day as one line: trips continuing at the same station within an hour share their stop, other
 * transfers within an hour are connected by a dotted line and longer ones are separated by a gap.
 */
export const JourneyTimeline = ({ statuses }: { statuses: StatusResource[] }) => {
  return (
    <Card>
      <ol className={styles.base}>
        {getJourneyTimeline(statuses).map((item, index) => {
          if (item.type === 'stop') return <JourneyStop key={index} {...item} />;
          if (item.type === 'trip') return <JourneyTrip key={index} status={item.status} />;

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
