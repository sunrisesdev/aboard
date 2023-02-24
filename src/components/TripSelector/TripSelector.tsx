import { DeparturesResponse } from '@/traewelling-sdk/functions/trains';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { MdTrain } from 'react-icons/md';
import useSWR from 'swr';
import LineIndicator from '../LineIndicator/LineIndicator';
import ProductIcon from '../ProductIcon/ProductIcon';
import { ProductIconProps, ProductIconVariant } from '../ProductIcon/types';
import ScrollArea from '../ScrollArea/ScrollArea';
import styles from './TripSelector.module.scss';
import { TripProps, TripSelectorProps } from './types';

const SPECIAL_PRODUCT_ICONS: Record<
  ProductIconVariant,
  (props: ProductIconProps) => ReactNode
> = {
  bus: ProductIcon.Bus,
  suburban: ProductIcon.Suburban,
  subway: ProductIcon.Subway,
  tram: ProductIcon.Tram,
};

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

const TripSelector = ({ onTripSelect, stationName }: TripSelectorProps) => {
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
                  onClick={() => onTripSelect(trip)}
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
  onClick,
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
  const plannedDepartureTime = new Date(plannedDepartureAt).toLocaleTimeString(
    [],
    { hour: '2-digit', minute: '2-digit' }
  );

  return (
    <button className={styles.trip} onClick={onClick}>
      <div className={classNames(styles.product, styles[product])} />

      <div className={styles.line}>
        {product in SPECIAL_PRODUCT_ICONS ? (
          SPECIAL_PRODUCT_ICONS[product as ProductIconVariant]({
            className: styles.productIcon,
          })
        ) : (
          <MdTrain className={styles.productIcon} size={20} />
        )}

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
        <div className={classNames({ [styles.isDelayed]: delay > 0 })}>
          {plannedDepartureTime}
        </div>
        {delay > 0 && <div>{departureTime}</div>}
      </div>
    </button>
  );
};

export default TripSelector;
