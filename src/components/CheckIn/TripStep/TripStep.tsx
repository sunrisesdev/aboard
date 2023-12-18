'use client';

import FilterButton from '@/components/FilterButton/FilterButton';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import { TripSelector } from '@/components/TripSelector/TripSelector';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { useDepartures } from '@/hooks/useDepartures/useDepartures';
import { radioCanada } from '@/styles/fonts';
import { TransportType } from '@/traewelling-sdk/types';
import { AboardMethod, AboardTrip } from '@/types/aboard';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  MdArrowBack,
  MdClose,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { CheckInContext } from '../CheckIn.context';
import styles from './TripStep.module.scss';

const getServedMethods = (trips: AboardTrip[]): AboardMethod[] => {
  if (trips.length === 0) return [];

  const departureStations = trips.map(
    ({ departureStation }) => departureStation
  );
  const methodSet = new Set<AboardMethod>();

  console.log(departureStations);

  departureStations.forEach(({ servesMethod }) => {
    if (!servesMethod) return;

    Object.entries(servesMethod).forEach(
      ([method, value]) => value && methodSet.add(method as AboardMethod)
    );
  });

  methodSet.delete('taxi');

  return Array.from(methodSet).sort((a, b) => a.localeCompare(b));
};

const TripStep = () => {
  const { departureTime, goBack, origin, setDepartureTime, setTrip } =
    useContext(CheckInContext);

  const [filter, setFilter] = useState<TransportType>();
  const { departures, isLoading } = useDepartures(origin?.name ?? '', {
    from: departureTime,
    transportType: filter,
  });

  const servedMethodsFetched = useRef(false);
  const [servedMethods, setServedMethods] = useState<AboardMethod[]>([]);

  useAppTheme('var(--sky-11)');

  useEffect(() => {
    if (servedMethodsFetched.current) return;

    const newMethods = getServedMethods(departures?.trips ?? []);
    if (newMethods.length > 0) {
      setServedMethods(newMethods);
      servedMethodsFetched.current = true;
    }
  }, [departures]);

  const servesMethod = (method: AboardMethod) => servedMethods.includes(method);

  const handleOnEarlierClick = () => {
    if (isLoading) {
      return;
    }

    setDepartureTime(departures?.meta?.times.prev);
  };

  const handleOnFilterClick = (value: TransportType) => {
    if (filter === value) {
      setFilter(undefined);
    } else {
      setFilter(value);
    }
  };

  const handleOnLaterClick = () => {
    if (isLoading) {
      return;
    }

    setDepartureTime(departures?.meta?.times.next);
  };

  return (
    <main className={clsx(radioCanada.className, styles.base)}>
      <header className={styles.header}>
        <button
          className={clsx(
            styles.backButton,
            servedMethods.length > 1 && styles.noBottomPadding
          )}
          onClick={goBack}
        >
          <div className={styles.icon}>
            <MdArrowBack size={20} />
          </div>
          <span>{origin?.name}</span>
        </button>

        {servedMethods.length > 1 && (
          <section className={styles.filters}>
            {(servesMethod('national') || servesMethod('national-express')) && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'express'}
                onClick={handleOnFilterClick}
                value="express"
              >
                Fernverkehr
              </FilterButton>
            )}
            {(servesMethod('regional') || servesMethod('regional-express')) && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'regional'}
                onClick={handleOnFilterClick}
                value="regional"
              >
                Regionalverkehr
              </FilterButton>
            )}
            {servesMethod('suburban') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'suburban'}
                onClick={handleOnFilterClick}
                value="suburban"
              >
                S-Bahnen
              </FilterButton>
            )}
            {servesMethod('subway') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'subway'}
                onClick={handleOnFilterClick}
                value="subway"
              >
                U-Bahnen
              </FilterButton>
            )}
            {servesMethod('tram') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'tram'}
                onClick={handleOnFilterClick}
                value="tram"
              >
                Straßenbahnen
              </FilterButton>
            )}
            {servesMethod('bus') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'bus'}
                onClick={handleOnFilterClick}
                value="bus"
              >
                Busse
              </FilterButton>
            )}
            {servesMethod('ferry') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'ferry'}
                onClick={handleOnFilterClick}
                value="ferry"
              >
                Fähren
              </FilterButton>
            )}
          </section>
        )}
      </header>

      <div className={styles.sheet}>
        <ScrollArea
          bottomFogBorderRadius="1rem"
          className={styles.scrollArea}
          topFogBorderRadius="1rem"
        >
          {departures?.trips && departures.trips.length > 0 && (
            <TripSelector
              onSelect={setTrip}
              requestedStation={origin}
              trips={departures.trips}
            />
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

      <footer className={styles.footer}>
        <button className={styles.timeButton} onClick={handleOnEarlierClick}>
          <div className={styles.icon}>
            <MdKeyboardDoubleArrowLeft size={20} />
          </div>
          <span>Früher</span>
        </button>

        {typeof departureTime !== 'undefined' && (
          <button
            className={styles.resetTimeButton}
            onClick={() => setDepartureTime(undefined)}
          >
            <span>
              ab{' '}
              {new Date(departureTime).toLocaleTimeString([], {
                timeStyle: 'short',
              })}
            </span>
            <MdClose size={16} />
          </button>
        )}

        <button className={styles.timeButton} onClick={handleOnLaterClick}>
          <span>Später</span>
          <div className={styles.icon}>
            <MdKeyboardDoubleArrowRight size={20} />
          </div>
        </button>
      </footer>
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

export default TripStep;
