'use client';

import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { useJoinCheckIn } from '@/hooks/useJoinCheckIn/useJoinCheckIn';
import { AboardStopover } from '@/types/aboard';
import { formatDate } from '@/utils/formatDate';
import { formatTime } from '@/utils/formatTime';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  MdArrowBack,
  MdCommit,
  MdDeleteForever,
  MdEdit,
  MdOutlineTimer,
  MdOutlineToken,
} from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import Button from '../Button/Button';
import { METHOD_ICONS } from '../CheckIn/consts';
import { NewLineIndicator } from '../NewLineIndicator/NewLineIndicator';
import Route from '../Route/Route';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './StatusDetails.module.scss';
import { NextStopoverCountdownProps, StatusDetailsProps } from './types';

const getMinutesUntil = (target: Date) => {
  return Math.ceil((target.getTime() - Date.now()) / 1000 / 60);
};

const getNextStopover = (stopovers: AboardStopover[]) => {
  const now = Date.now();

  for (const stopover of stopovers) {
    if (stopover.status === 'cancelled') {
      continue;
    }

    const arrival = new Date(stopover.arrival.actual!).getTime();

    if (arrival < now) {
      continue;
    }

    return stopover;
  }
};

const StatusDetails = ({
  destinationIndex,
  originIndex,
  status,
  stopovers = [],
  trip,
}: StatusDetailsProps) => {
  const { data: session } = useSession();
  const user = session?.user;

  const relevantStopovers = stopovers.slice(
    originIndex,
    typeof destinationIndex === 'undefined' ? undefined : destinationIndex + 1
  );

  const [nextStopover, setNextStopover] = useState<AboardStopover | undefined>(
    getNextStopover(relevantStopovers)
  );

  useAppTheme(status.journey.line.appearance.accentColor!);

  const isDestinationNext =
    nextStopover && stopovers.indexOf(nextStopover) === destinationIndex;

  const { duration } = status.journey;
  const formattedDuration =
    duration < 60
      ? `${duration % 60} Minute${duration % 60 > 1 ? 'n' : ''}`
      : `${Math.floor(duration / 60)} Std. ${duration % 60} Min.`;

  const arrivalSchedule = parseSchedule({
    actual: status.journey.destination.arrival.actual,
    planned: status.journey.destination.arrival.planned!,
  });

  const departureSchedule = parseSchedule({
    actual: status.journey.origin.departure.actual,
    planned: status.journey.origin.departure.planned!,
  });

  const designation =
    trip?.designation ??
    stopovers.at(-1)?.station.name ??
    status.journey.destination.station.name;

  const checkInDate = formatDate(new Date(status.createdAt));
  const checkedInAt = formatTime(new Date(status.createdAt));

  const { content, startOrResume } = useJoinCheckIn();

  const handleJoinClick = () => {
    // startOrResume(status, trip);
    // if (trip) {
    //   const stops: { area?: string; station: string }[] = [];
    //   const tripParts = trip.stopovers.map((stop) =>
    //     stop.name.split(',').map((part) => part.trim())
    //   );
    //   for (let i = 0; i < tripParts.length; i++) {
    //     const previousStop = i <= 0 ? undefined : tripParts[i - 1];
    //     const stop = tripParts[i];
    //     const nextStop =
    //       i >= tripParts.length - 1 ? undefined : tripParts[i + 1];
    //     const lastSegments = [
    //       (previousStop ?? ['!']).at(-1)!,
    //       stop.at(-1)!,
    //       (nextStop ?? ['!']).at(-1)!,
    //     ];
    //     if (lastSegments[0].length < lastSegments[1].length) {
    //       if (lastSegments[1].startsWith(lastSegments[0])) {
    //         stops.push({
    //           area: lastSegments[1],
    //           station: tripParts[i].slice(0, -1).join(', '),
    //         });
    //         continue;
    //       }
    //     } else {
    //       if (lastSegments[0].startsWith(lastSegments[1])) {
    //         stops.push({
    //           area: lastSegments[0],
    //           station: tripParts[i].slice(0, -1).join(', '),
    //         });
    //         continue;
    //       }
    //     }
    //     if (lastSegments[2].length < lastSegments[1].length) {
    //       if (lastSegments[1].startsWith(lastSegments[2])) {
    //         stops.push({
    //           area: lastSegments[1],
    //           station: tripParts[i].slice(0, -1).join(', '),
    //         });
    //         continue;
    //       }
    //     } else {
    //       if (lastSegments[2].startsWith(lastSegments[1])) {
    //         stops.push({
    //           area: lastSegments[2],
    //           station: tripParts[i].slice(0, -1).join(', '),
    //         });
    //         continue;
    //       }
    //     }
    //     const firstSegments = [
    //       (previousStop ?? [''])[0],
    //       stop[0],
    //       (nextStop ?? [''])[0],
    //     ];
    //     if (firstSegments.filter((v) => v === stop[0]).length > 1) {
    //       stops.push({
    //         area: stop[0],
    //         station: tripParts[i].slice(1).join(', '),
    //       });
    //       continue;
    //     }
    //     stops.push({ station: tripParts[i].join(', ') });
    //   }
    //   stops.forEach((stop, i) => {
    //     if (stop.area && stop.station) {
    //       trip.stopovers[i].name = `${stop.station}###${stop.area}`;
    //     } else {
    //       trip.stopovers[i].name = stop.station || stop.area || '';
    //     }
    //   });
    // }
  };

  const isJoinable = !!trip;

  return (
    <ThemeProvider appearance={status.journey.line.appearance}>
      <main className={styles.base}>
        <header className={styles.header}>
          <nav className={styles.navigation}>
            <Link href="/dashboard">
              <div className={styles.button}>
                <MdArrowBack size={20} />
              </div>
            </Link>

            <div className={styles.date}>{checkInDate}</div>
            <div className={clsx(styles.actions)}>
              <button
                className={clsx(
                  styles.actionButton,
                  styles.editButton,
                  user?.id !== status.userId && styles.hidden
                )}
              >
                <MdEdit size={20} />
              </button>

              <button
                className={clsx(
                  styles.actionButton,
                  styles.deleteButton,
                  user?.id !== status.userId && styles.hidden
                )}
              >
                <MdDeleteForever size={20} />
              </button>
            </div>
          </nav>

          <div className={styles.train}>
            <div className={styles.lineName}>
              {METHOD_ICONS[status.journey.line.method]({
                className: styles.productIcon,
              })}

              <NewLineIndicator line={status.journey.line} />
            </div>

            <span>{designation}</span>
          </div>

          <section className={styles.route}>
            <Route>
              <Route.Entry
                lineSlot={
                  <Route.Line
                    variant={isDestinationNext ? 'hybrid' : 'default'}
                  />
                }
              >
                <div className={styles.station}>
                  <span>{status.journey.origin.station.name}</span>
                  <Route.Time schedule={departureSchedule} type="departure" />
                </div>
              </Route.Entry>

              {nextStopover && !isDestinationNext && (
                <Route.Entry
                  lineSlot={<Route.Line variant="partial" />}
                  stopIndicatorVariant="pulsating"
                >
                  <div className={clsx(styles.station, styles.upcoming)}>
                    <span>{nextStopover.station.name}</span>
                    <NextStopoverCountdown
                      next={nextStopover}
                      setNext={setNextStopover}
                      stopovers={relevantStopovers}
                    />
                  </div>
                </Route.Entry>
              )}

              <Route.Entry>
                <div className={styles.station}>
                  <span>{status.journey.destination.station.name}</span>
                  {isDestinationNext && (
                    <span className={clsx(styles.extraTime, styles.upcoming)}>
                      <NextStopoverCountdown
                        next={nextStopover}
                        setNext={setNextStopover}
                        stopovers={relevantStopovers}
                      />
                    </span>
                  )}
                  <Route.Time schedule={arrivalSchedule} type="arrival" />
                </div>
              </Route.Entry>
            </Route>
          </section>
        </header>

        <div className={styles.sheet}>
          <div className={styles.creator}>
            <Image
              alt={`Avatar von ${status.username}`}
              className={styles.avatar}
              height={42}
              src={status.userAvatarUrl}
              width={42}
            />

            <div className={styles.username}>{status.username}</div>
            <div className={styles.time}>{checkedInAt}</div>
          </div>

          {!!status.message.trim() && (
            <article className={styles.body}>{status.message}</article>
          )}

          <ul className={styles.stats}>
            <li>
              <div className={styles.key}>
                <MdOutlineTimer className={styles.icon} size={16} />
                <span>Fahrzeit</span>
              </div>
              <div className={styles.value}>{formattedDuration}</div>
            </li>
            <li>
              <div className={styles.key}>
                <TbRoute className={styles.icon} size={16} />
                <span>Entfernung</span>
              </div>
              <div className={styles.value}>
                {status.journey.distance >= 1000
                  ? `${Math.ceil(status.journey.distance / 1000)} km`
                  : `${status.journey.distance} m`}
              </div>
            </li>
            <li>
              <div className={styles.key}>
                <MdOutlineToken className={styles.icon} size={16} />
                <span>Punkte</span>
              </div>
              <div className={styles.value}>
                {status.journey.pointsAwarded} Punkt
                {status.journey.pointsAwarded > 1 && 'e'}
              </div>
            </li>
            <li>
              <div className={styles.key}>
                <MdCommit className={styles.icon} size={16} />
                <span>Stationen</span>
              </div>
              <div className={styles.value}>
                {relevantStopovers.length - 1} Station
                {relevantStopovers.length > 2 && 'en'}
              </div>
            </li>
          </ul>

          {isJoinable && (
            <Button
              className={styles.joinButton}
              onClick={handleJoinClick}
              variant="primary"
            >
              Check-In beitreten
            </Button>
          )}

          {content}
        </div>
      </main>
    </ThemeProvider>
  );
};

const NextStopoverCountdown = ({
  next,
  setNext,
  stopovers,
}: NextStopoverCountdownProps) => {
  const arrival = useMemo(
    () => new Date(next?.arrival.actual ?? next?.arrival.planned!),
    [next?.arrival]
  );
  const [remaining, setRemaining] = useState(getMinutesUntil(arrival));

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = getMinutesUntil(arrival);
      setRemaining(minutes);

      if (minutes < 0) {
        setNext(getNextStopover(stopovers));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arrival, setNext, stopovers]);

  return (
    <span className={styles.time}>
      {remaining <= 0 ? 'jetzt' : `in ${Math.abs(remaining)} Min.`}
    </span>
  );
};

export default StatusDetails;
