import { inter } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { TbClockQuestion, TbRouteOff } from 'react-icons/tb';
import { METHOD_ICONS } from '../CheckIn/consts';
import { NewLineIndicator } from '../NewLineIndicator/NewLineIndicator';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import { Time } from '../Time/Time';
import styles from './TripSelector.module.scss';
import { TripProps, TripSelectorProps } from './types';

export const TripSelector = ({
  onSelect,
  requestedStation,
  trips,
}: TripSelectorProps) => {
  return (
    <ul className={styles.base}>
      {trips.map((trip) => (
        <li
          key={`${trip.hafasId}@${trip.departureStation?.ibnr}@${trip.departure?.planned}`}
        >
          <Trip
            onClick={() => onSelect(trip)}
            requestedStationName={requestedStation?.name}
            trip={trip}
          />
        </li>
      ))}
    </ul>
  );
};

const Trip = ({ onClick, requestedStationName, trip }: TripProps) => {
  const departsFromDeviatingStation =
    requestedStationName !== trip.departureStation?.name;

  // const isCancelled = !trip.departure?.actual;
  const isCancelled = false;
  const isInLimbo = !trip.departure?.actual;

  const schedule = parseSchedule({
    actual: trip.departure?.actual ?? '',
    planned: trip.departure?.planned ?? '',
  });

  const trimmedLineName = trip.line.name
    .replace(trip.line.appearance.productName, '')
    .trim();
  const showRunningNumber =
    !!trip.runningNumber && trimmedLineName !== trip.runningNumber;

  const isTimeDocked = isCancelled || departsFromDeviatingStation;

  const fr = trip.hafasId?.match(/#FR#(\d+)#/)?.[1];
  const to = trip.hafasId?.match(/#TO#(\d+)#/)?.[1];

  return (
    <ThemeProvider appearance={trip.line.appearance}>
      <button
        aria-disabled={isCancelled}
        className={clsx(styles.trip, isInLimbo && styles.inLimbo)}
        data-line-id={trip.line.id}
        data-operator-id={trip.line.operator?.id}
        onClick={onClick}
      >
        <aside className={styles.decoratedBorder} />
        <div className={styles.content}>
          <div className={styles.lineIndicatorContainer}>
            <NewLineIndicator line={trip.line} noOutline />
          </div>

          <div className={styles.detailsContainer}>
            <div className={styles.designation}>{trip.designation}</div>

            {showRunningNumber && (
              <div className={clsx(inter.className, styles.runningNumber)}>
                {METHOD_ICONS[trip.line.method]({
                  className: styles.methodIcon,
                })}

                <span>{trip.runningNumber}</span>
              </div>
            )}

            {departsFromDeviatingStation && (
              <div className={styles.deviationNote}>
                ab {trip.departureStation?.name}
              </div>
            )}

            {isInLimbo && (
              <div className={styles.limboNote}>
                <TbClockQuestion fontSize={16} /> Live-Status unbekannt
              </div>
            )}
          </div>

          <div
            className={clsx(
              styles.timeContainer,
              isTimeDocked && styles.isDocked
            )}
          >
            <Time
              className={styles.time}
              delayStyle="p+a"
              schedule={schedule}
            />
            <Time
              className={styles.time}
              delayStyle="p+a"
              schedule={schedule}
            />
          </div>

          {isCancelled && (
            <aside
              className={clsx(
                styles.banner,
                departsFromDeviatingStation && styles.isCloser
              )}
            >
              <div className={clsx(inter.className, styles.cancelledNote)}>
                <TbRouteOff />
                <span>Fällt aus</span>
              </div>
            </aside>
          )}
        </div>
      </button>
      <p className={styles.stationIds}>
        {fr}, {to}
      </p>
    </ThemeProvider>
  );
};
