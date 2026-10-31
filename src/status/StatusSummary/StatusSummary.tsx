import { IconArrowRight, IconPencilFilled } from '@tabler/icons-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/Card/Card';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TintedSurface } from '@/components/TintedSurface/TintedSurface';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatDistance } from '@/helpers/formatDistance';
import { formatDuration } from '@/helpers/formatDuration';
import { getDelay } from '@/helpers/getDelay';
import { getLineColors } from '@/helpers/getLineColors';
import { getUserHref } from '@/helpers/getUserHref';
import type { StatusResource } from '@/lib/traewelling';
import { getCheckinMode } from '@/status/getCheckinMode';
import { getCheckinTimes } from '@/status/getCheckinTimes';
import { StatusBody } from '@/status/StatusBody/StatusBody';
import { StatusLikeButton } from '@/status/StatusLikeButton/StatusLikeButton';
import styles from './StatusSummary.module.css';

// The line fills up by CSS animation like in StatusTrip, here split into the halves before and after the arrow
function getProgressStyles(departure: string, arrival: string, now: Date) {
  const startDelay = new Date(departure).getTime() - now.getTime();
  const halfDuration = (new Date(arrival).getTime() - new Date(departure).getTime()) / 2;

  return [startDelay, startDelay + halfDuration].map((delay) => ({
    animationDelay: `${delay}ms`,
    animationDuration: `${halfDuration}ms`,
  }));
}

// Experimental: marks times that differ from the plan because the user entered them manually
function getTiming(planned: string | null, real: string | null, manual: string | null | undefined) {
  const time = manual ?? real ?? planned;

  return {
    delay: planned && time ? getDelay(planned, time) : undefined,
    icon: manual && <IconPencilFilled data-via-icon title="Manuell bearbeitet" />,
    time,
  };
}

export const StatusSummary = ({ status }: { status: StatusResource }) => {
  const { bodyMentions, checkin, createdAt, user } = status;
  const { destination, origin } = checkin;
  const mode = getCheckinMode(checkin);
  const body = typeof status.body === 'string' ? status.body : undefined;
  const { arrival, departure } = getCheckinTimes(checkin);
  const now = new Date();

  // Hidden when the line name already contains it, e.g. "ICE 123"
  const journeyNumber = checkin.manualJourneyNumber ?? checkin.journeyNumber?.toString();
  const showJourneyNumber =
    journeyNumber && journeyNumber !== checkin.lineName && !checkin.lineName.split(/\s+/).includes(journeyNumber);

  const arrivalTiming = getTiming(destination.arrivalPlanned, destination.arrivalReal, checkin.manualArrival);
  const departureTiming = getTiming(origin.departurePlanned, origin.departureReal, checkin.manualDeparture);

  const progressStyles =
    arrival && departure && now < new Date(arrival) ? getProgressStyles(departure, arrival, now) : undefined;

  return (
    <Card className={styles.base}>
      <header className={styles.header}>
        {/* Hidden from assistive tech and the tab order, since the name next to it links to the same profile */}
        <Link aria-hidden className={styles.avatarLink} href={getUserHref(user.username)} tabIndex={-1}>
          <Image alt="" className={styles.avatar} height={40} src={user.profilePicture} width={40} />
        </Link>
        <div>
          <div>
            <Link href={getUserHref(user.username)}>
              <span className={styles.author}>{user.displayName}</span>
              <span className={styles.username}>@{user.username}</span>
            </Link>
          </div>
          <time className={styles.meta} dateTime={createdAt}>
            {formatDateTime(createdAt)}
          </time>
        </div>
      </header>

      {body && <StatusBody body={body} mentions={bodyMentions} />}

      <Link className={styles.tripLink} href={`/status/${status.id}`}>
        <TintedSurface
          color={getLineColors({ color: checkin.routeColor, mode }).background}
          radius="1rem"
          style={{ width: '100%' }}
        >
          <TintedSurface.Content className={styles.tripContent}>
            <div className={styles.tripHeader}>
              <TransportModeIcon height={20} mode={mode} width={20} />

              <LineBadge
                backgroundColor={checkin.routeColor ?? undefined}
                color={checkin.routeTextColor ?? undefined}
                journeyNumber={journeyNumber}
                mode={mode}
                name={checkin.lineName}
                productName={undefined}
              />

              {showJourneyNumber && <em style={{ whiteSpace: 'nowrap' }}>{journeyNumber}</em>}

              <span className={styles.tripFacts}>
                {[formatDistance(checkin.distance), arrival && departure && formatDuration(departure, arrival)]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            </div>

            <div className={styles.row}>
              {departureTiming.time && (
                <div className={styles.timeGroup}>
                  <time className={styles.time} dateTime={departureTiming.time}>
                    {formatDateTime(departureTiming.time, 'time')}
                  </time>

                  {!!departureTiming.delay?.minutes && (
                    <span className={styles.delayBadge} data-via-delay={departureTiming.delay.status}>
                      {departureTiming.icon}
                      {formatDelay(departureTiming.delay.minutes)}
                    </span>
                  )}
                </div>
              )}

              {arrivalTiming.time && (
                <div className={clsx(styles.timeGroup, styles.arrival)}>
                  {!!arrivalTiming.delay?.minutes && (
                    <span className={styles.delayBadge} data-via-delay={arrivalTiming.delay.status}>
                      {arrivalTiming.icon}
                      {formatDelay(arrivalTiming.delay.minutes)}
                    </span>
                  )}

                  <time className={styles.time} dateTime={arrivalTiming.time}>
                    {formatDateTime(arrivalTiming.time, 'time')}
                  </time>
                </div>
              )}
            </div>

            <TripLine className={styles.tripLine} orientation="horizontal">
              <TripLine.StopIndicator />

              <div className={styles.segment}>
                <TripLine.RouteSegment partial={!!progressStyles} />
                {/* The server renders with a slightly earlier `now` */}
                {progressStyles && (
                  <div className={styles.progress} style={progressStyles[0]} suppressHydrationWarning />
                )}
              </div>

              <IconArrowRight className={styles.arrow} size={16} stroke={2} />

              <div className={styles.segment}>
                <TripLine.RouteSegment partial={!!progressStyles} />
                {progressStyles && (
                  <div className={styles.progress} style={progressStyles[1]} suppressHydrationWarning />
                )}
              </div>

              <TripLine.StopIndicator />
            </TripLine>

            <div className={styles.row}>
              <Marquee className={styles.station}>{cleanStationName(origin.station.name)}</Marquee>
              <Marquee className={clsx(styles.station, styles.arrival)}>
                {cleanStationName(destination.station.name)}
              </Marquee>
            </div>
          </TintedSurface.Content>
        </TintedSurface>
      </Link>

      {status.isLikable && <StatusLikeButton className={styles.likeButton} status={status} />}
    </Card>
  );
};
