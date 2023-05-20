import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { useContext } from 'react';
import { MdArrowForward, MdAutoMode } from 'react-icons/md';
import { VscRefresh } from 'react-icons/vsc';
import LineIndicator from '../LineIndicator/LineIndicator';
import styles from './LiveCheckInSummary.module.scss';

const LiveCheckInSummary = () => {
  const { journey, nextCheckIn, remainingCheckIns, untilNextCheckIn } =
    useContext(LiveCheckInContext);

  if (!journey.length) {
    return null;
  }

  return (
    <section className={styles.base}>
      <MdAutoMode className={styles.watermark} size={128} />

      <div className={styles.header}>
        <MdAutoMode size={20} />
        <span>Live Check-In</span>
      </div>

      <div className={styles.destination}>
        <MdArrowForward size={20} />
        <span>{journey.at(-1)?.destination.name}</span>
      </div>
      {remainingCheckIns.length > 0 && nextCheckIn && (
        <div className={styles.description}>
          via <span>{remainingCheckIns[0].trip.station.name}</span>
          {remainingCheckIns.length > 1 &&
            ` und ${remainingCheckIns.length - 1} weitere`}
        </div>
      )}

      {nextCheckIn && (
        <footer className={styles.footer}>
          <div className={styles.upcoming}>
            <div className={styles.title}>Nächster Check-In</div>
            <div className={styles.train}>
              <LineIndicator
                className={styles.lineIndicator}
                lineId={nextCheckIn.trip.line.id}
                lineName={nextCheckIn.trip.line.name}
                product={nextCheckIn.trip.line.product}
                productName=""
              />
              <span>{nextCheckIn.trip.direction}</span>

              {untilNextCheckIn && untilNextCheckIn <= 0 && (
                <div className={styles.spinner}>
                  <VscRefresh size={24} />
                </div>
              )}
            </div>
          </div>

          {untilNextCheckIn && untilNextCheckIn > 1 && (
            <div className={styles.time}>
              {Math.ceil(untilNextCheckIn / 1000 / 60)}
              <span>MIN</span>
            </div>
          )}
        </footer>
      )}
    </section>
  );
};

export default LiveCheckInSummary;
