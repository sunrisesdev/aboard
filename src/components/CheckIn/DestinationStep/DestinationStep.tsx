'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import { useStops } from '@/hooks/useStops/useStops';
import { inter } from '@/styles/fonts';
import classNames from 'classnames';
import { useContext } from 'react';
import { MdArrowBack, MdMergeType } from 'react-icons/md';
import { TbRouteOff } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './DestinationStep.module.scss';
import { StopProps } from './types';

const DestinationStep = () => {
  const { goBack, origin, setDestination, trip } = useContext(CheckInContext);
  const { isLoading, stops } = useStops(
    trip?.tripId ?? '',
    trip?.line.name ?? '',
    trip?.plannedWhen ?? '',
    trip?.station.id.toString() ?? ''
  );

  const departure = trip && new Date(trip.plannedWhen);

  const departureTime = departure?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main
      className={styles.base}
      style={{
        ['--accent-color' as any]: `var(--color-${trip?.line.product})`,
      }}
    >
      <header className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          <div className="arrow">
            <MdArrowBack size={20} />
          </div>
          {trip && (
            <div className={styles.lineName}>
              {PRODUCT_ICONS[trip.line.product]({
                className: styles.productIcon,
              })}
              <LineIndicator
                className={styles.lineIndicator}
                lineName={trip.line.name}
                product={trip.line.product}
                productName={trip.line.productName}
              />
            </div>
          )}
          <div style={{ width: '1.25rem' }} />
        </button>

        <div className={styles.direction}>{trip?.direction}</div>

        {trip?.station.name !== origin?.name && (
          <div className={styles.deviationNotice}>
            <MdMergeType size={18} />
            <span>Abweichende Abfahrt von einer Station in der Nähe</span>
          </div>
        )}

        <div className={styles.origin}>
          <div className={styles.station}>
            <div>{trip?.station.name}</div>
            <span className={styles.time}>
              ab {departureTime}
              {trip && trip.delay > 0 && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{trip.delay / 60}</sup>
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.sheet}>
        <ScrollArea className={styles.scrollArea}>
          {stops && stops.length > 0 && (
            <ul className={styles.stopList}>
              {stops.map((stop, index) => (
                <li key={index}>
                  <Stop
                    arrivalAt={stop.arrival ?? stop.departure}
                    isCancelled={stop.cancelled}
                    isDelayed={
                      stop.isArrivalDelayed ||
                      (!stop.arrival && stop.isDepartureDelayed)
                    }
                    name={stop.name}
                    onClick={() => setDestination(stop)}
                    plannedArrivalAt={
                      stop.arrivalPlanned ?? stop.departurePlanned
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <ul className={styles.stopList}>
              <li>
                <StopSkeleton />
              </li>
              <li>
                <StopSkeleton />
              </li>
              <li>
                <StopSkeleton />
              </li>
              <li>
                <StopSkeleton />
              </li>
              <li>
                <StopSkeleton />
              </li>
            </ul>
          )}
        </ScrollArea>
      </div>
    </main>
  );
};

const StopSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={classNames(styles.stop, styles.isSkeleton)}>
      <div className={styles.name}>
        <Shimmer width={`${width}%`} />
      </div>

      <div className={styles.time}>
        <Shimmer width="2rem" />
      </div>
    </button>
  );
};

const Stop = ({
  arrivalAt,
  isCancelled,
  isDelayed,
  name,
  onClick,
  plannedArrivalAt,
}: StopProps) => {
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
    <button className={styles.stop} disabled={isCancelled} onClick={onClick}>
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

export default DestinationStep;
