'use client';

import useAccentColor from '@/hooks/useAccentColor/useAccentColor';
import { useStatus } from '@/hooks/useStatus/useStatus';
import { useStops } from '@/hooks/useStops/useStops';
import { Stop } from '@/traewelling-sdk/types';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { MdCommit, MdOutlineTimer, MdOutlineToken } from 'react-icons/md';
import { TbRoute } from 'react-icons/tb';
import LineIndicator from '../LineIndicator/LineIndicator';
import styles from './StatusDetails.module.scss';
import { CurrentStopProps, StatusDetailsProps } from './types';

const findCurrentStop = (stops: Stop[], destination: Stop) => {
  const now = Date.now();

  for (const stop of stops) {
    if (stop.cancelled) {
      continue;
    }

    const departure = new Date(stop.departureReal!).getTime();

    if (
      stop.id === destination.id &&
      stop.departureReal === destination.departureReal
    ) {
      return;
    }

    if (now > departure) {
      continue;
    }

    return stop;
  }
};

const getMinutesUntil = (target: Date) => {
  return Math.ceil((target.getTime() - Date.now()) / 1000 / 60);
};

const StatusDetails = ({ id }: StatusDetailsProps) => {
  const { status } = useStatus(id);
  const { stops: allStops } = useStops(
    status?.train.hafasId ?? '',
    status?.train.lineName ?? '',
    status?.train.origin.departurePlanned ?? '',
    status?.train.origin.id.toString() ?? ''
  );

  const destinationAt = allStops.findIndex(
    (stop) =>
      stop.id === status?.train.destination.id &&
      stop.departureReal === status.train.destination.departureReal
  );
  const stops = allStops.slice(0, destinationAt);

  useAccentColor(`var(--color-${status?.train.category})`);

  if (status === undefined) {
    return <div>Lade...</div>;
  }

  if (status === null) {
    return <div>Status nicht gefunden</div>;
  }

  const destination = allStops.at(-1);

  const currentStop = findCurrentStop(stops, status.train.destination);
  const showCurrentStop =
    !!currentStop && currentStop.name !== status.train.destination.name;

  const timeInMin =
    (new Date(status.train.destination.arrivalReal!).getTime() -
      new Date(status.train.origin.departureReal!).getTime()) /
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
          <span>{destination?.name}</span>
        </div>

        <div
          className={clsx(styles.origin, !showCurrentStop && styles.isTight)}
        >
          <div className={styles.station}>
            <span>{status.train.origin.name}</span>
            <span className={styles.time}>
              ab {departureSchedule.planned}
              {!departureSchedule.isOnTime && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{departureSchedule.delayInMinutes}</sup>
                </span>
              )}
            </span>
          </div>
        </div>

        {showCurrentStop && currentStop && (
          <div className={styles.upcoming}>
            <div className={styles.station}>
              <CurrentStop
                destination={status.train.destination}
                stops={stops}
              />
            </div>
          </div>
        )}

        <div
          className={clsx(
            styles.destination,
            !showCurrentStop && styles.withLine
          )}
        >
          <div className={styles.station}>
            <span>{status.train.destination.name}</span>
            <span className={styles.time}>
              an {arrivalSchedule.planned}
              {!arrivalSchedule.isOnTime && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{arrivalSchedule.delayInMinutes}</sup>
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.sheet}>
        <ul className={styles.stats}>
          <li>
            <MdOutlineTimer size={20} />
            <span>{duration}</span>
          </li>
          <li>
            <TbRoute size={20} />
            <span>{Math.ceil(status.train.distance / 1000)} km</span>
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

const CurrentStop = ({ destination, stops }: CurrentStopProps) => {
  const [currentStop, setCurrentStop] = useState<Stop | undefined>(
    findCurrentStop(stops, destination)
  );
  const arrival = useMemo(
    () => new Date(currentStop?.arrivalReal!),
    [currentStop?.arrivalReal]
  );
  const [remaining, setRemaining] = useState(getMinutesUntil(arrival));

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = getMinutesUntil(arrival);
      setRemaining(minutes);

      if (minutes < 0) {
        setCurrentStop(findCurrentStop(stops, destination));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [arrival, destination, stops]);

  return (
    <>
      <span>{currentStop?.name}</span>
      <span className={styles.time}>
        {remaining === 0 ? 'jetzt' : `in ${Math.abs(remaining)} Min.`}
      </span>
    </>
  );
};

export default StatusDetails;
