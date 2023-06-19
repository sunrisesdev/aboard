import { getWhiteLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_ICONS } from '../CheckIn/consts';
import LineIndicator from '../LineIndicator/LineIndicator';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './StatusCard.module.scss';
import { StatusCardProps } from './types';

const StatusCard = ({ status }: StatusCardProps) => {
  const hasArrived =
    new Date(
      status.train.destination.arrival ??
        status.train.destination.arrivalReal ??
        ''
    ).getTime() <= Date.now();

  const arrivalSchedule = parseSchedule({
    actual:
      status.train.destination.arrivalReal ??
      status.train.destination.arrival ??
      '',
    planned: status.train.destination.arrivalPlanned ?? '',
  });

  const departureSchedule = parseSchedule({
    actual:
      status.train.origin.departureReal ?? status.train.origin.departure ?? '',
    planned: status.train.origin.departurePlanned ?? '',
  });

  return (
    <ThemeProvider
      theme={getWhiteLineTheme(status.train.number, status.train.category)}
    >
      <Link className={styles.link} href={`/status/${status.id}`}>
        <article className={styles.base}>
          <header className={styles.header}>
            <Image
              alt={`Profilbild von ${status.username}`}
              className={styles.avatar}
              height={32}
              src={status.profilePicture}
              style={{ flexShrink: 0 }}
              unoptimized
              width={32}
            />
            <div>
              <div className={styles.username}>{status.username}</div>
            </div>
            {PRODUCT_ICONS[status.train.category]({
              className: styles.productIcon,
            })}
          </header>
          <header className={styles.origin}>
            <div className={styles.stop} />
            <div>{status.train.origin.name}</div>
            <div className={styles.time}>{departureSchedule.actual}</div>
          </header>
          <section className={styles.destination}>
            <div className={styles.station}>
              {status.train.destination.name}
            </div>
            <div className={styles.footer}>
              <div className={styles.line} />
              <LineIndicator
                className={styles.lineIndicator}
                lineId={status.train.number}
                lineName={status.train.lineName}
                product={status.train.category}
                productName=""
              />
              <div className={styles.stop} />
              <div className={styles.time}>{arrivalSchedule.actual}</div>
            </div>
          </section>
        </article>
      </Link>
    </ThemeProvider>
  );
};

export default StatusCard;
