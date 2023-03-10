'use client';

import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import { useDepartures } from '@/hooks/useDepartures/useDepartures';
import { inter } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useContext, useLayoutEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { TbRouteOff } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './TripStep.module.scss';
import { TripProps } from './types';

const TripStep = () => {
  const { goBack, origin, setTrip } = useContext(CheckInContext);
  const { departures, isLoading } = useDepartures(origin?.name ?? '');

  useLayoutEffect(() => {
    document.body.style.setProperty('--accent-color', 'var(--sky11)');

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
          <span>{origin?.name}</span>
        </button>
      </header>

      <div className={styles.sheet}>
        <ScrollArea className={styles.scrollArea} topFogBorderRadius="1rem">
          {departures?.trips && departures.trips.length > 0 && (
            <ul className={styles.tripList}>
              {departures.trips.map((trip) => (
                <li
                  key={`${trip.tripId}@${trip.station.ibnr}@${trip.plannedWhen}`}
                >
                  <Trip
                    delay={trip.delay}
                    departureAt={trip.when}
                    destination={trip.direction ?? trip.destination.name}
                    lineName={trip.line.name}
                    onClick={() => setTrip(trip)}
                    plannedDepartureAt={trip.plannedWhen}
                    product={trip.line.product}
                    productName={trip.line.productName}
                    selectedStationName={origin?.name ?? ''}
                    stationName={trip.station.name}
                    tripNumber={trip.line.fahrtNr}
                  />
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <ul className={styles.tripList}>
              <li>
                <TripSkeleton />
              </li>
              <li>
                <TripSkeleton />
              </li>
              <li>
                <TripSkeleton />
              </li>
              <li>
                <TripSkeleton />
              </li>
              <li>
                <TripSkeleton />
              </li>
            </ul>
          )}
        </ScrollArea>
      </div>
    </main>
  );
};

const TripSkeleton = () => {
  const width = Math.random() * (85 - 50) + 50;

  return (
    <button className={clsx(styles.trip, styles.isSkeleton)}>
      <div className={styles.product} />

      <div className={styles.line}>
        <Shimmer
          height="1.25rem"
          style={{ borderRadius: '9999rem' }}
          width="1.25rem"
        />

        <Shimmer
          height="1.25rem"
          style={{ borderRadius: '9999rem' }}
          width="1.75rem"
        />
      </div>

      <div className={styles.direction}>
        <Shimmer height="1.125rem" width={`${width}%`} />
      </div>

      <div className={styles.time}>
        <Shimmer width="2rem" />
      </div>
    </button>
  );
};

const Trip = ({
  delay,
  departureAt,
  destination,
  lineName,
  onClick,
  plannedDepartureAt,
  product,
  productName,
  selectedStationName,
  stationName,
  tripNumber,
}: TripProps) => {
  const schedule = parseSchedule({
    actual: departureAt,
    delay,
    planned: plannedDepartureAt,
  });

  return (
    <button
      className={styles.trip}
      disabled={departureAt === null}
      onClick={onClick}
    >
      <div className={clsx(styles.product, styles[product])} />

      <div className={styles.line}>
        {PRODUCT_ICONS[product]({
          className: styles.productIcon,
        })}

        <LineIndicator
          lineName={lineName}
          product={product}
          productName={productName}
        />
      </div>

      <div className={styles.direction}>
        <div className={styles.destination}>{destination}</div>
        {selectedStationName !== stationName && (
          <div className={styles.deviatingStation}>ab {stationName}</div>
        )}
      </div>

      <div className={styles.time}>
        <div className={clsx({ [styles.isDelayed]: !schedule.isOnTime })}>
          {schedule.planned}
        </div>
        {!schedule.isOnTime && <div>{schedule.actual}</div>}
      </div>

      {departureAt === null && (
        <aside className={clsx(styles.cancelledNote, inter.className)}>
          <TbRouteOff />
          <span>F??llt aus</span>
        </aside>
      )}
    </button>
  );
};

export default TripStep;
