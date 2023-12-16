'use client';

import FilterButton from '@/components/FilterButton/FilterButton';
import { NewLineIndicator } from '@/components/NewLineIndicator/NewLineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { useDepartures } from '@/hooks/useDepartures/useDepartures';
import { inter } from '@/styles/fonts';
import { TransportType } from '@/traewelling-sdk/types';
import { AboardMethod, AboardTrip } from '@/types/aboard';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import colorConvert from 'color-convert';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  MdArrowBack,
  MdClose,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { TbRouteOff } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import { METHOD_ICONS } from '../consts';
import styles from './TripStep.module.scss';
import { TripProps } from './types';

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
    <main className={styles.base}>
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
            <ul className={styles.tripList}>
              {departures.trips.map((trip) => (
                <li
                  key={`${trip.id}@${trip.departureStation.ibnr}@${trip.departure?.planned}`}
                >
                  <Trip
                    onClick={() => setTrip(trip)}
                    selectedStationName={origin?.name ?? ''}
                    trip={trip}
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

const Trip = ({ onClick, selectedStationName, trip }: TripProps) => {
  const schedule = parseSchedule({
    actual: trip.departure?.actual ?? '',
    planned: trip.departure?.planned ?? '',
  });

  const accentRGB = colorConvert.hex
    .rgb(trip.line.appearance.accentColor!)
    .join(', ');
  const contrastRGB = colorConvert.hex
    .rgb(trip.line.appearance.contrastColor!)
    .join(', ');

  return (
    <ThemeProvider
      color={trip.line.appearance.accentColor}
      colorRGB={accentRGB}
      contrast={trip.line.appearance.contrastColor}
      contrastRGB={contrastRGB}
    >
      <button
        aboard-line-id={trip.line.id}
        className={styles.trip}
        disabled={!trip.departure?.actual}
        onClick={onClick}
      >
        <div className={styles.product} />

        <div className={styles.line}>
          {METHOD_ICONS[trip.line.method]({
            className: styles.productIcon,
          })}

          <NewLineIndicator line={trip.line} noOutline />
        </div>

        <div className={styles.direction}>
          <div className={styles.destination}>{trip.designation}</div>
          {selectedStationName !== trip.departureStation.name && (
            <div className={styles.deviatingStation}>
              ab {trip.departureStation.name}
            </div>
          )}
        </div>

        <div className={styles.time}>
          <div className={clsx({ [styles.isDelayed]: !schedule.isOnTime })}>
            {schedule.planned}
          </div>
          {!schedule.isOnTime && <div>{schedule.actual}</div>}
        </div>

        {!trip.departure?.actual === null && (
          <aside className={clsx(styles.cancelledNote, inter.className)}>
            <TbRouteOff />
            <span>Fällt aus</span>
          </aside>
        )}
      </button>
    </ThemeProvider>
  );
};

export default TripStep;
