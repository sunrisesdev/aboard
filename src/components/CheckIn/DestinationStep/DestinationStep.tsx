'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import { useStops } from '@/hooks/useStops/useStops';
import { inter } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useContext, useLayoutEffect } from 'react';
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

  const schedule = parseSchedule({
    actual: trip?.when,
    delay: trip?.delay,
    planned: trip?.plannedWhen!,
  });

  useLayoutEffect(() => {
    document.body.style.setProperty(
      '--accent-color',
      `var(--color-${trip?.line.product})`
    );

    return () => {
      document.body.style.removeProperty('--accent-color');
    };
  });

  return (
    <main className={styles.base}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          <div className={styles.arrow}>
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
              ab {schedule.planned}
              {!schedule.isOnTime && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{schedule.delayInMinutes}</sup>
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      <div className={styles.sheet}>
        <ScrollArea className={styles.scrollArea} topFogBorderRadius="1rem">
          {stops && stops.length > 0 && (
            <ul
              className={styles.stopList}
              style={{ ['--stop-count' as any]: stops.length }}
            >
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
    <button className={clsx(styles.stop, styles.isSkeleton)}>
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
  const schedule = parseSchedule({
    actual: arrivalAt,
    planned: plannedArrivalAt!,
  });

  return (
    <button className={styles.stop} disabled={isCancelled} onClick={onClick}>
      <div className={styles.name}>{name}</div>

      {!isCancelled ? (
        <div className={styles.time}>
          <div className={clsx({ [styles.isDelayed]: isDelayed })}>
            {schedule.planned}
          </div>
          {isDelayed && <div>{schedule.actual}</div>}
        </div>
      ) : (
        <aside className={clsx(styles.cancelledNote, inter.className)}>
          <TbRouteOff />
          <span>Halt entfällt</span>
        </aside>
      )}
    </button>
  );
};

export default DestinationStep;
