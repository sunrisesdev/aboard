'use client';

import ScrollArea from '@/components/ScrollArea/ScrollArea';
import { useDepartures } from '@/hooks/useDepartures/useDepartures';
import { useContext } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { CheckInContext } from '../CheckIn.context';
import { PRODUCT_ICONS } from '../consts';
import styles from './DestinationStep.module.scss';

const DestinationStep = () => {
  const { goBack, origin, trip } = useContext(CheckInContext);
  const { departures, isLoading } = useDepartures(origin?.name ?? '');

  return (
    <main
      className={styles.base}
      style={{
        ['--background-color' as any]: `var(--color-${trip?.line.product})`,
      }}
    >
      <header className={styles.header}>
        <button className={styles.backButton} onClick={goBack}>
          <div className="arrow">
            <MdArrowBack size={20} />
          </div>
          {trip &&
            PRODUCT_ICONS[trip.line.product]({ className: styles.productIcon })}
          <span>{origin?.name}</span>
        </button>
      </header>

      <div className={styles.sheet}>
        <ScrollArea className={styles.scrollArea}>
          {departures?.trips && departures.trips.length > 0 && (
            <ul className={styles.stopList}>
              {departures.trips.map((trip) => (
                <li
                  key={`${trip.tripId}@${trip.station.ibnr}@${trip.plannedWhen}`}
                >
                  <div />
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <ul className={styles.stopList}>
              <li>
                <div />
              </li>
              <li>
                <div />
              </li>
              <li>
                <div />
              </li>
              <li>
                <div />
              </li>
              <li>
                <div />
              </li>
            </ul>
          )}
        </ScrollArea>
      </div>
    </main>
  );
};

export default DestinationStep;
