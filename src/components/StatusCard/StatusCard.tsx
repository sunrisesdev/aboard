import { getWhiteLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import Image from 'next/image';
import LineIndicator from '../LineIndicator/LineIndicator';
import Route from '../Route/Route';
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

  return (
    <ThemeProvider
      theme={getWhiteLineTheme(status.train.number, status.train.category)}
    >
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
            <div style={{ fontSize: '0.875rem', marginTop: '-4px' }}>
              {status.train.origin.name}
            </div>
          </div>

          {/* <div className={styles.time}>
            {formatTime(new Date(status.createdAt))}
          </div> */}
        </header>

        <section className={styles.route}>
          <div style={{ marginTop: '-30px' }}>
            <Route>
              <Route.Entry
                lineSlot={
                  <Route.Line variant={hasArrived ? 'default' : 'hybrid'} />
                }
              >
                <div style={{ height: '1.5rem' }} />
              </Route.Entry>
              <Route.Entry>{status.train.destination.name}</Route.Entry>
            </Route>
          </div>
        </section>

        <footer
          style={{
            alignItems: 'center',
            display: 'flex',
            padding: '0.5rem',
          }}
        >
          <LineIndicator
            lineId={status.train.number}
            lineName={status.train.lineName}
            product={status.train.category}
            productName=""
          />
        </footer>
      </article>
    </ThemeProvider>
  );
};

export default StatusCard;
