'use client';

import FilterButton from '@/components/FilterButton/FilterButton';
import LineIndicator from '@/components/LineIndicator/LineIndicator';
import ScrollArea from '@/components/ScrollArea/ScrollArea';
import Shimmer from '@/components/Shimmer/Shimmer';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import useAppTheme from '@/hooks/useAppTheme/useAppTheme';
import { useDepartures } from '@/hooks/useDepartures/useDepartures';
import { inter } from '@/styles/fonts';
import {
  HAFASProductType,
  HAFASStop,
  HAFASTrip,
} from '@/traewelling-sdk/hafasTypes';
import { TransportType } from '@/traewelling-sdk/types';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { TbRouteOff } from 'react-icons/tb';
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './TripStep.module.scss';
import { TripProps } from './types';

const getServedProducts = (trips: HAFASTrip[]) => {
  if (trips.length === 0) return [];

  const stops = trips.reduce((stops, trip) => {
    if (stops.some(({ id }) => id === trip.stop.id)) {
      return stops;
    }

    return [...stops, trip.stop];
  }, [] as HAFASStop[]);

  const productSet = new Set<HAFASProductType>();

  stops.forEach(({ products }) => {
    Object.entries(products).forEach(([type, value]) => {
      value && productSet.add(type as HAFASProductType);
    });
  });

  productSet.delete('taxi');

  return Array.from(productSet).sort((a, b) => a.localeCompare(b));
};

const TripStep = () => {
  const { goBack, origin, setTrip } = useContext(CheckInContext);

  const [filter, setFilter] = useState<TransportType>();
  const { departures, isLoading } = useDepartures(origin?.name ?? '', filter);

  const productsFetched = useRef(false);
  const [products, setProducts] = useState<HAFASProductType[]>([]);

  useAppTheme('var(--sky11)');

  useEffect(() => {
    if (productsFetched.current) return;

    const newProducts = getServedProducts(departures?.trips ?? []);
    if (newProducts.length > 0) {
      setProducts(newProducts);
      productsFetched.current = true;
    }
  }, [departures]);

  const hasProduct = (product: HAFASProductType) => products.includes(product);

  const handleOnFilterClick = (value: TransportType) => {
    if (filter === value) {
      setFilter(undefined);
    } else {
      setFilter(value);
    }
  };

  return (
    <main className={styles.base}>
      <header className={styles.header}>
        <button
          className={clsx(
            styles.backButton,
            products.length > 1 && styles.noBottomPadding
          )}
          onClick={goBack}
        >
          <div className={styles.arrow}>
            <MdArrowBack size={20} />
          </div>
          <span>{origin?.name}</span>
        </button>

        {products.length > 1 && (
          <section className={styles.filters}>
            {(hasProduct('national') || hasProduct('nationalExpress')) && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'express'}
                onClick={handleOnFilterClick}
                value="express"
              >
                Fernverkehr
              </FilterButton>
            )}
            {(hasProduct('regional') || hasProduct('regionalExp')) && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'regional'}
                onClick={handleOnFilterClick}
                value="regional"
              >
                Regionalverkehr
              </FilterButton>
            )}
            {hasProduct('suburban') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'suburban'}
                onClick={handleOnFilterClick}
                value="suburban"
              >
                S-Bahnen
              </FilterButton>
            )}
            {hasProduct('subway') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'subway'}
                onClick={handleOnFilterClick}
                value="subway"
              >
                U-Bahnen
              </FilterButton>
            )}
            {hasProduct('tram') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'tram'}
                onClick={handleOnFilterClick}
                value="tram"
              >
                Straßenbahnen
              </FilterButton>
            )}
            {hasProduct('bus') && (
              <FilterButton
                className={styles.filterButton}
                isActive={filter === 'bus'}
                onClick={handleOnFilterClick}
                value="bus"
              >
                Busse
              </FilterButton>
            )}
            {hasProduct('ferry') && (
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
                    lineId={trip.line.id}
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
  lineId,
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

  const theme = getLineTheme(lineId, product);

  return (
    <ThemeProvider theme={theme}>
      <button
        className={styles.trip}
        disabled={departureAt === null}
        onClick={onClick}
      >
        <div className={styles.product} />

        <div className={styles.line}>
          {PRODUCT_ICONS[product]({
            className: styles.productIcon,
          })}

          <LineIndicator
            lineId={lineId}
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
            <span>Fällt aus</span>
          </aside>
        )}
      </button>
    </ThemeProvider>
  );
};

export default TripStep;
