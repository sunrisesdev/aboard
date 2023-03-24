'use client';

import useAccentColor from '@/hooks/useAccentColor/useAccentColor';
import { useStops } from '@/hooks/useStops/useStops';
import { Stop } from '@/traewelling-sdk/types';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { MdCommit, MdOutlineTimer, MdOutlineToken } from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import LineIndicator from '../LineIndicator/LineIndicator';
import Route from '../Route/Route';
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

const StatusDetails = ({ status }: StatusDetailsProps) => {
  const [nextStop, setNextStop] = useState<Stop>();
  const { stops: allStops } = useStops(
    status.train.hafasId ?? '',
    status.train.lineName ?? '',
    status.train.origin.departurePlanned ?? '',
    status.train.origin.id.toString() ?? ''
  );

  const direction = allStops.at(-1)?.name;
  const destinationAt = allStops.findIndex(
    (stop) =>
      stop.id === status.train.destination.id &&
      stop.departure === status.train.destination.departure
  );
  const stops = allStops.slice(0, destinationAt + 1);

  useEffect(() => {
    setNextStop(getNextStop(stops));
  }, [stops]);

  useAccentColor(`var(--color-${status.train.category})`);

  const isDestinationNext =
    !!nextStop &&
    nextStop.id === status.train.destination.id &&
    nextStop.departure === status.train.destination.departure;

  const timeInMin =
    (new Date(status.train.destination.arrival!).getTime() -
      new Date(status.train.origin.departure!).getTime()) /
    1000 /
    60;
  const duration = `${Math.floor(timeInMin / 60)} Std. ${timeInMin % 60} Min.`;

  const arrivalSchedule = parseSchedule({
    actual: status.train.destination.arrival,
    planned: status.train.destination.arrivalPlanned!,
  });

  const departureSchedule = parseSchedule({
    actual: status.train.origin.departure,
    planned: status.train.origin.departurePlanned!,
  });

  return (
    <main className={styles.base}>
      <header className={styles.header}>
        <div className={styles.direction}>
          <LineIndicator
            className={styles.lineIndicator}
            lineName={status.train.lineName}
            product={status.train.category}
            productName=""
          />
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
        <article className={styles.message}>
          <Image
            alt="Avatar"
            height={42}
            src={(status as any).profilePicture}
            width={42}
          />

          <div>
            <div className={styles.username}>{status.username}</div>
            {!!status.body.trim() && (
              <div className={styles.body}>{status.body}</div>
            )}
          </div>
        </article>

        <ul className={styles.stats}>
          <li>
            <MdOutlineTimer size={20} />
            <span>{duration}</span>
          </li>
          <li>
            <TbRoute size={20} />
            {status.train.distance >= 1000 ? (
              <span>{Math.ceil(status.train.distance / 1000)} km</span>
            ) : (
              <span>{status.train.distance} m</span>
            )}
          </li>
          <li>
            <MdOutlineToken size={20} />
            <span>{status.train.points} Punkte</span>
          </li>
          <li>
            <MdCommit size={20} />
            <span>{stops.length + 1} Stationen</span>
          </li>
        </ul>
      </div>
    </main>
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
