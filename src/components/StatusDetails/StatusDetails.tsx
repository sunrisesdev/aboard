'use client';

import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { useJoinCheckIn } from '@/hooks/useJoinCheckIn/useJoinCheckIn';
import { useStops } from '@/hooks/useStops/useStops';
import { useTrip } from '@/hooks/useTrip/useTrip';
import { CheckinInput } from '@/traewelling-sdk/functions/trains';
import { Stop } from '@/traewelling-sdk/types';
import { formatDate } from '@/utils/formatDate';
import { formatTime } from '@/utils/formatTime';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition } from 'react';
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
import { PRODUCT_ICONS } from '../CheckIn/consts';
import LineIndicator from '../LineIndicator/LineIndicator';
import Route from '../Route/Route';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './StatusDetails.module.scss';
import { NextStopCountdownProps, StatusDetailsProps } from './types';

const getMinutesUntil = (target: Date) => {
  return Math.ceil((target.getTime() - Date.now()) / 1000 / 60);
};

const getNextStop = (stops: Stop[]) => {
  const now = Date.now();

  for (const stop of stops) {
    if (stop.cancelled) {
      continue;
    }

    const departure = new Date(stop.departure!).getTime();

    if (now > departure) {
      continue;
    }

    return stop;
  }
};

const post = async (status: CheckinInput, session?: Session | null) => {
  const token = session?.user.accessToken;

  if (!token) {
    return;
  }

  const response = await fetch('/traewelling/stations/checkin', {
    body: JSON.stringify(status),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw response;
  }

  return await response.json();
};

const StatusDetails = ({
  status,
  stops: initialStops = [],
}: StatusDetailsProps) => {
  const [nextStop, setNextStop] = useState<Stop>();
  const { data: session } = useSession();
  const user = session?.user;
  const { stops: allStops } = useStops(
    status.train.hafasId,
    status.train.lineName,
    status.train.origin.departurePlanned ?? '',
    status.train.origin.id.toString()
  );

  const direction = (allStops ?? initialStops).at(-1)?.name;
  const destinationAt = (allStops ?? initialStops).findIndex(
    (stop) =>
      stop.id === status.train.destination.id &&
      stop.departure === status.train.destination.departure
  );
  const stops = (allStops ?? initialStops).slice(0, destinationAt + 1);

  useEffect(() => {
    setNextStop(getNextStop(stops));
  }, [stops]);

  const theme = getLineTheme(status.train.number, status.train.category);
  useAppTheme(theme.accent);

  const isDestinationNext =
    !!nextStop &&
    nextStop.id === status.train.destination.id &&
    nextStop.departure === status.train.destination.departure;

  const timeInMin =
    (new Date(status.train.destination.arrival!).getTime() -
      new Date(status.train.origin.departure!).getTime()) /
    1000 /
    60;
  const duration =
    timeInMin < 60
      ? `${timeInMin % 60} Minute${timeInMin % 60 > 1 ? 'n' : ''}`
      : `${Math.floor(timeInMin / 60)} Std. ${timeInMin % 60} Min.`;

  const arrivalSchedule = parseSchedule({
    actual: status.train.destination.arrival,
    planned: status.train.destination.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: status.train.origin.departure,
    planned: status.train.origin.departurePlanned!,
  });

  const checkInDate = formatDate(new Date(status.createdAt));
  const checkedInAt = formatTime(new Date(status.createdAt));
  const [_isPending, startTransition] = useTransition();
  const [joined, setJoined] = useState(false);

  const checkIn = async () => {
    try {
      await post(
        {
          arrival: status.train.destination.arrivalPlanned!,
          body: status.body,
          business: status.business,
          departure: status.train.origin.departurePlanned!,
          destination: status.train.destination.evaIdentifier,
          ibnr: true,
          lineName: status.train.lineName,
          start: status.train.origin.evaIdentifier,
          tripId: status.train.hafasId,
          visibility: status.visibility,
        },
        session
      );

      setTimeout(() => setJoined(true), 500);
    } catch {}
  };

  const { trip } = useTrip(
    status.train.hafasId,
    status.train.lineName,
    status.train.origin.id.toString()
  );

  const { content, startOrResume } = useJoinCheckIn();

  const handleJoinClick = () => {
    startOrResume(status, trip);

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

  return (
    <ThemeProvider theme={theme}>
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
                  user?.id !== status.user && styles.hidden
                )}
              >
                <MdEdit size={20} />
              </button>

              <button
                className={clsx(
                  styles.actionButton,
                  styles.deleteButton,
                  user?.id !== status.user && styles.hidden
                )}
              >
                <MdDeleteForever size={20} />
              </button>
            </div>
          </nav>

          <div className={styles.train}>
            <div className={styles.lineName}>
              {PRODUCT_ICONS[status.train.category]({
                className: styles.productIcon,
              })}

              <LineIndicator
                isInverted
                lineId={status.train.number}
                lineName={status.train.lineName}
                product={status.train.category}
                productName=""
              />
            </div>

            <span>{direction}</span>
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
                  <span>{status.train.origin.name}</span>
                  <Route.Time schedule={departureSchedule} type="departure" />
                </div>
              </Route.Entry>

              {nextStop && !isDestinationNext && (
                <Route.Entry
                  lineSlot={<Route.Line variant="partial" />}
                  stopIndicatorVariant="pulsating"
                >
                  <div className={clsx(styles.station, styles.upcoming)}>
                    <span>{nextStop.name}</span>
                    <NextStopCountdown
                      nextStop={nextStop}
                      setNextStop={setNextStop}
                      stops={stops}
                    />
                  </div>
                </Route.Entry>
              )}

              <Route.Entry>
                <div className={styles.station}>
                  <span>{status.train.destination.name}</span>
                  {isDestinationNext && (
                    <span className={clsx(styles.extraTime, styles.upcoming)}>
                      <NextStopCountdown
                        nextStop={nextStop}
                        setNextStop={setNextStop}
                        stops={stops}
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
              src={(status as any).profilePicture}
              width={42}
            />

            <div className={styles.username}>{status.username}</div>
            <div className={styles.time}>{checkedInAt}</div>
          </div>

          {!!status.body.trim() && (
            <article className={styles.body}>{status.body}</article>
          )}

          <ul className={styles.stats}>
            <li>
              <div className={styles.key}>
                <MdOutlineTimer className={styles.icon} size={16} />
                <span>Fahrzeit</span>
              </div>
              <div className={styles.value}>{duration}</div>
            </li>
            <li>
              <div className={styles.key}>
                <TbRoute className={styles.icon} size={16} />
                <span>Entfernung</span>
              </div>
              <div className={styles.value}>
                {status.train.distance >= 1000
                  ? `${Math.ceil(status.train.distance / 1000)} km`
                  : `${status.train.distance} m`}
              </div>
            </li>
            <li>
              <div className={styles.key}>
                <MdOutlineToken className={styles.icon} size={16} />
                <span>Punkte</span>
              </div>
              <div className={styles.value}>
                {status.train.points} Punkt{status.train.points > 1 && 'e'}
              </div>
            </li>
            <li>
              <div className={styles.key}>
                <MdCommit className={styles.icon} size={16} />
                <span>Stationen</span>
              </div>
              <div className={styles.value}>
                {stops.length} Station{stops.length > 1 && 'en'}
              </div>
            </li>
          </ul>

          {/* <Button
            className={styles.joinButton}
            disabled={joined}
            onClick={checkIn}
            variant="primary"
          >
            {joined ? 'Erfolgreich beigetreten!' : 'Check-In beitreten'}
          </Button> */}
          <Button
            className={styles.joinButton}
            onClick={handleJoinClick}
            variant="primary"
          >
            Check-In beitreten
          </Button>

          {content}
        </div>
      </main>
    </ThemeProvider>
  );
};

const NextStopCountdown = ({
  nextStop,
  setNextStop,
  stops,
}: NextStopCountdownProps) => {
  const arrival = useMemo(
    () => new Date(nextStop?.arrival!),
    [nextStop?.arrival]
  );
  const [remaining, setRemaining] = useState(getMinutesUntil(arrival));

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = getMinutesUntil(arrival);
      setRemaining(minutes);

      if (minutes < 0) {
        setNextStop(getNextStop(stops));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arrival, setNextStop, stops]);

  return (
    <span className={styles.time}>
      {remaining <= 0 ? 'jetzt' : `in ${Math.abs(remaining)} Min.`}
    </span>
  );
};

export default StatusDetails;
