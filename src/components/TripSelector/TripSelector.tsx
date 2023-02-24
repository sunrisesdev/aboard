import { inter } from '@/styles/fonts';
import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './TripSelector.module.scss';
import { TripProps, TripSelectorProps } from './types';

const HIDDEN_PRODUCT_NAMES = ['Bus', 'STR'];

const fetcher = async (
  stationName: string,
  token?: string
): Promise<DeparturesResponse> => {
  if (!stationName.trim() || !token) {
    return { meta: null, trips: [] };
  }

  const response = await fetch(
    `/api/stations/${stationName.replace('/', '%20')}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    return { meta: null, trips: [] };
  }

  return await response.json();
};

const TripSelector = ({ stationName }: TripSelectorProps) => {
  const { data: session } = useSession();
  const { data: departures } = useSWR(
    ['/api/stations/', stationName, session?.traewelling.token],
    ([_, stationName, token]) => fetcher(stationName, token)
  );

  return (
    <div className={styles.base}>
      <ScrollArea className={styles.scrollArea}>
        {departures?.trips && departures.trips.length > 0 && (
          <ul className={styles.trips}>
            {departures.trips.map((trip) => (
              <li key={`${trip.tripId}@${trip.station.ibnr}`}>
                <Trip
                  delay={trip.delay}
                  departureAt={trip.when}
                  destination={trip.direction ?? trip.destination.name}
                  lineName={trip.line.name}
                  plannedDepartureAt={trip.plannedWhen}
                  product={trip.line.product}
                  productName={trip.line.productName}
                  selectedStationName={stationName}
                  stationName={trip.station.name}
                  tripNumber={trip.line.fahrtNr}
                />
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

const Trip = ({
  delay,
  departureAt,
  destination,
  lineName,
  plannedDepartureAt,
  product,
  productName,
  selectedStationName,
  stationName,
  tripNumber,
}: TripProps) => {
  const departureTime = new Date(
    departureAt ?? plannedDepartureAt
  ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const lineIndicator = !HIDDEN_PRODUCT_NAMES.includes(productName)
    ? lineName
    : lineName.replace(productName, '').trim();

  return (
    <button className={styles.trip}>
      <div className={classNames(styles.product, styles[product])} />

      <div className={styles.line}>
        <div
          className={classNames(styles.lineIndicator, inter.className)}
          style={{ backgroundColor: `var(--color-${product})` }}
        >
          {lineIndicator}
        </div>
      </div>

      <div className={styles.direction}>
        <div className={styles.destination}>{destination}</div>
        {selectedStationName !== stationName && (
          <div className={styles.divertingStation}>ab {stationName}</div>
        )}
      </div>

      <div>{departureTime}</div>
    </button>
  );
};

export default TripSelector;
