import { inter } from '@/styles/fonts';
import { TripResponse } from '@/traewelling-sdk/functions/trains';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { TbRouteOff } from 'react-icons/tb';
import useSWR from 'swr';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './DestinationSelector.module.scss';
import { DestinationSelectorProps, StationProps } from './types';

const fetcher = async (
  hafasTripId: string,
  lineName: string,
  start: string,
  token?: string
): Promise<TripResponse | undefined> => {
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
  const { data: trip } = useSWR(
    ['/api/trips', hafasTripId, lineName, start, session?.traewelling.token],
    ([_, hafasTripId, lineName, start, token]) =>
      fetcher(hafasTripId, lineName, start, token)
  );

  const startingAt = trip?.stopovers.findIndex(
    ({ departurePlanned, id }) =>
      plannedDeparture === departurePlanned && start === id.toString()
  );
  const stops =
    trip?.stopovers.slice(
      typeof startingAt === 'undefined' ? 0 : startingAt + 1
    ) ?? [];

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
      </ScrollArea>
    </div>
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
