import { inter } from '@/styles/fonts';
import { TripResponse } from '@/traewelling-sdk/functions/trains';
import classNames from 'classnames';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { TbRouteOff } from 'react-icons/tb';
import useSWR from 'swr';
import ScrollArea from '../ScrollArea/ScrollArea';
import Shimmer from '../Shimmer/Shimmer';
import styles from './DestinationSelector.module.scss';
import { DestinationSelectorProps, StationProps } from './types';

const fetcher = async (
  hafasTripId: string,
  lineName: string,
  start: string,
  session?: Session | null
): Promise<TripResponse | undefined> => {
  const token = session?.user.accessToken;

  if (!hafasTripId || !lineName || !start.trim() || !token) {
    return;
  }

  const response = await fetch(
    `/api/trips?hafasTripId=${hafasTripId}&lineName=${lineName}&start=${start.replace(
      '/',
      '%20'
    )}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return;
  }

  return await response.json();
};

const DestinationSelector = ({
  hafasTripId,
  lineName,
  onDestinationSelect,
  plannedDeparture,
  start,
}: DestinationSelectorProps) => {
  const { data: session } = useSession();
  const { data: trip, isLoading } = useSWR(
    ['/api/trips', hafasTripId, lineName, start, session],
    ([_, hafasTripId, lineName, start, session]) =>
      fetcher(hafasTripId, lineName, start, session)
  );

  const startingAt = trip?.stopovers.findIndex(
    ({ departurePlanned, id }) =>
      plannedDeparture === departurePlanned && start === id.toString()
  );
  const stops =
    trip?.stopovers.slice(
      typeof startingAt === 'undefined' ? 0 : startingAt + 1
    ) ?? [];

  if (stops.length === 1) {
    onDestinationSelect(stops[0]);
  }

  return (
    <div className={styles.base}>
      <ScrollArea className={styles.scrollArea}>
        {trip?.stopovers && stops.length > 0 && (
          <ul className={styles.stations}>
            {stops.map((stopover, index) => (
              <li key={index}>
                <Station
                  arrivalAt={stopover.arrival ?? stopover.departure}
                  isCancelled={stopover.cancelled}
                  isDelayed={
                    stopover.isArrivalDelayed || stopover.isDepartureDelayed
                  }
                  name={stopover.name}
                  onClick={() => onDestinationSelect(stopover)}
                  plannedArrivalAt={
                    stopover.arrivalPlanned ?? stopover.departurePlanned
                  }
                />
              </li>
            ))}
          </ul>
        )}

        {isLoading && (
          <ul className={styles.stations}>
            <li>
              <StationSkeleton />
            </li>
            <li>
              <StationSkeleton />
            </li>
            <li>
              <StationSkeleton />
            </li>
            <li>
              <StationSkeleton />
            </li>
            <li>
              <StationSkeleton />
            </li>
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

const StationSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={classNames(styles.station, styles.isSkeleton)}>
      <div className={styles.name}>
        <Shimmer width={`${width}%`} />
      </div>

      <div className={styles.time}>
        <Shimmer width="2rem" />
      </div>
    </button>
  );
};

const Station = ({
  arrivalAt,
  isCancelled,
  isDelayed,
  name,
  onClick,
  plannedArrivalAt,
}: StationProps) => {
  const arrivalTime =
    arrivalAt &&
    new Date(arrivalAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  const plannedArrivalTime =
    plannedArrivalAt &&
    new Date(plannedArrivalAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <button className={styles.station} disabled={isCancelled} onClick={onClick}>
      <div className={styles.name}>{name}</div>

      {!isCancelled ? (
        <div className={styles.time}>
          <div className={classNames({ [styles.isDelayed]: isDelayed })}>
            {plannedArrivalTime}
          </div>
          {isDelayed && <div>{arrivalTime}</div>}
        </div>
      ) : (
        <aside className={classNames(styles.cancelledNote, inter.className)}>
          <TbRouteOff />
          <span>Halt entfällt</span>
        </aside>
      )}
    </button>
  );
};

export default DestinationSelector;
