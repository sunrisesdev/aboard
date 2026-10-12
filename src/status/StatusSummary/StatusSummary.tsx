import { IconArrowRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import { Card } from '@/components/Card/Card';
import { ColoredLayer } from '@/components/ColoredLayer/ColoredLayer';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatDistance } from '@/helpers/formatDistance';
import { formatDuration } from '@/helpers/formatDuration';
import { getDelay } from '@/helpers/getDelay';
import { getLineColors } from '@/helpers/getLineColors';
import type { MotisMode, StatusResource } from '@/lib/traewelling';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { StatusBody } from '@/status/StatusBody/StatusBody';
import styles from './StatusSummary.module.css';

// The line fills up by CSS animation like in StatusTrip, here split into the halves before and after the arrow
const getProgressStyles = (departure: string, arrival: string, now: Date) => {
  const startDelay = new Date(departure).getTime() - now.getTime();
  const halfDuration = (new Date(arrival).getTime() - new Date(departure).getTime()) / 2;

  return [startDelay, startDelay + halfDuration].map((delay) => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${halfDuration}ms`,
  }));
};

export const StatusSummary = ({ status }: { status: StatusResource }) => {
  const { bodyMentions, checkin, createdAt, user } = status;
  const { destination, origin } = checkin;
  const body = typeof status.body === 'string' ? status.body : undefined;
  const { arrival, departure } = getCheckinTimes(checkin);
  const now = new Date();

  const arrivalDelay = destination.arrivalPlanned
    ? getDelay(destination.arrivalPlanned, destination.arrivalReal)
    : undefined;
  const arrivalTime = destination.arrivalReal ?? destination.arrivalPlanned;
  const departureDelay = origin.departurePlanned ? getDelay(origin.departurePlanned, origin.departureReal) : undefined;
  const departureTime = origin.departureReal ?? origin.departurePlanned;

  const progressStyles =
    arrival && departure && now < new Date(arrival) ? getProgressStyles(departure, arrival, now) : undefined;

  return (
    <Card>
      <header className={styles.header}>
        <Image alt="" className={styles.avatar} height={40} src={user.profilePicture} width={40} />
        <div>
          <div>
            <span className={styles.author}>{user.displayName}</span>
            <span className={styles.username}>@{user.username}</span>
          </div>
          <time className={styles.meta} dateTime={createdAt}>
            {formatDateTime(createdAt)}
          </time>
        </div>
      </header>

      {body && <StatusBody body={body} className={styles.body} mentions={bodyMentions} />}

      <ColoredLayer
        className={styles.trip}
        color={getLineColors({ color: checkin.routeColor, mode: checkin.mode }).background ?? 'var(--via-fg-primary)'}
        radius="1rem"
      >
        <ColoredLayer.Content className={styles.tripContent}>
          <div className={styles.tripHeader}>
            <LineBadge
              backgroundColor={checkin.routeColor ?? undefined}
              className={styles.lineBadge}
              color={checkin.routeTextColor ?? undefined}
              journeyNumber={checkin.manualJourneyNumber ?? String(checkin.journeyNumber)}
              mode={(checkin.mode ?? undefined) as MotisMode | undefined}
              name={checkin.lineName}
              productName={undefined}
            />

            <span className={styles.tripFacts}>
              {[formatDistance(checkin.distance), arrival && departure && formatDuration(departure, arrival)]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>

          <div className={styles.row}>
            {departureTime && (
              <div className={styles.timeGroup}>
                <time className={styles.time} dateTime={departureTime}>
                  {formatDateTime(departureTime, 'time')}
                </time>

                {!!departureDelay?.minutes && (
                  <span className={styles.delayBadge} data-via-delay={departureDelay.status}>
                    {formatDelay(departureDelay.minutes)}
                  </span>
                )}
              </div>
            )}

            {arrivalTime && (
              <div className={clsx(styles.timeGroup, styles.arrival)}>
                {!!arrivalDelay?.minutes && (
                  <span className={styles.delayBadge} data-via-delay={arrivalDelay.status}>
                    {formatDelay(arrivalDelay.minutes)}
                  </span>
                )}

                <time className={styles.time} dateTime={arrivalTime}>
                  {formatDateTime(arrivalTime, 'time')}
                </time>
              </div>
            )}
          </div>

          <TripLine className={styles.tripLine} orientation="horizontal">
            <TripLine.StopIndicator />

            <div className={styles.segment}>
              <TripLine.RouteSegment partial={!!progressStyles} />
              {/* The server renders with a slightly earlier `now` */}
              {progressStyles && <div className={styles.progress} style={progressStyles[0]} suppressHydrationWarning />}
            </div>

            <IconArrowRight className={styles.arrow} size={16} stroke={2} />

            <div className={styles.segment}>
              <TripLine.RouteSegment partial={!!progressStyles} />
              {progressStyles && <div className={styles.progress} style={progressStyles[1]} suppressHydrationWarning />}
            </div>

            <TripLine.StopIndicator />
          </TripLine>

          <div className={styles.row}>
            <Marquee className={styles.station}>{cleanStationName(origin.station.name)}</Marquee>
            <Marquee className={clsx(styles.station, styles.arrival)}>
              {cleanStationName(destination.station.name)}
            </Marquee>
          </div>
        </ColoredLayer.Content>
      </ColoredLayer>
    </Card>
  );
};
