'use client';

import { LiveCheckInContext } from '@/contexts/LiveCheckIn/LiveCheckIn.context';
import { useContext } from 'react';
import Route from '../Route/Route';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './LiveCheckInDetails.module.scss';

const LiveCheckInDetails = () => {
  const { journey } = useContext(LiveCheckInContext);

  return (
    <main className={styles.base}>
      <ThemeProvider
        contrast="#FFAC2E"
        contrastRGB="255, 172, 46"
        color="#FFF"
        colorRGB="255, 255, 255"
      >
        <section className={styles.route}>
          <Route>
            <Route.Entry lineSlot={<Route.Line variant="default" />}>
              <div className={styles.station}>
                <span>Station A</span>
                <span className={styles.time}>04:11</span>
              </div>
            </Route.Entry>

            <Route.Entry>
              <div className={styles.station}>
                <span>Station B</span>
                <span className={styles.time}>04:11</span>
              </div>
            </Route.Entry>
          </Route>
        </section>
      </ThemeProvider>

      <ThemeProvider
        contrast="#A3007C"
        contrastRGB="163, 0, 124"
        color="#FFF"
        colorRGB="255, 255, 255"
      >
        <section className={styles.route}>
          <Route>
            <Route.Entry lineSlot={<Route.Line variant="default" />}>
              <div className={styles.station}>
                <span>Station A</span>
                <span className={styles.time}>04:11</span>
              </div>
            </Route.Entry>

            <Route.Entry>
              <div className={styles.station}>
                <span>Station B</span>
                <span className={styles.time}>04:11</span>
              </div>
            </Route.Entry>
          </Route>
        </section>
      </ThemeProvider>
    </main>
  );
};

export default LiveCheckInDetails;
