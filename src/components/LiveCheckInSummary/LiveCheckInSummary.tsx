import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { useContext } from 'react';
import { MdArrowForward, MdAutoMode } from 'react-icons/md';
import LineIndicator from '../LineIndicator/LineIndicator';
import styles from './LiveCheckInSummary.module.scss';

const LiveCheckInSummary = () => {
  const { journey } = useContext(LiveCheckInContext);

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
      <div className={styles.description}>
        via <span>Allerweg, Hannover</span> und 1 weiteren
      </div>

      <footer className={styles.footer}>
        <div className={styles.upcoming}>
          <div className={styles.title}>Nächster Check-In</div>
          <div className={styles.train}>
            <LineIndicator
              lineId={journey[0].trip.line.id}
              lineName={journey[0].trip.line.name}
              product={journey[0].trip.line.product}
              productName=""
            />
            <span>{journey[0].trip.direction}</span>
          </div>
        </div>

        <div className={styles.time}>
          59<span>MIN</span>
        </div>
      </footer>
    </section>
  );
};

export default LiveCheckInSummary;
