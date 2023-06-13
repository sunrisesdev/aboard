import {
  getLineTheme,
  getWhiteLineTheme,
} from '@/helpers/getLineTheme/getLineTheme';
import { parseSchedule } from '@/utils/parseSchedule';
import { MdSwitchAccessShortcut } from 'react-icons/md';
import { TbWalk } from 'react-icons/tb';
import LineIndicator from '../LineIndicator/LineIndicator';
import Route from '../Route/Route';
import ThemeProvider from '../ThemeProvider/ThemeProvider';
import styles from './LiveCheckInPart.module.scss';
import { LiveCheckInPartProps } from './types';

const LiveCheckInPart = ({
  checkIn,
  hasSubsequentChangeover,
}: LiveCheckInPartProps) => {
  const arrivalSchedule = parseSchedule({
    actual: checkIn.destination.arrivalReal ?? checkIn.destination.arrival,
    planned: checkIn.destination.arrivalPlanned!,
  });
  const departureSchedule = parseSchedule({
    actual: checkIn.trip.when,
    planned: checkIn.trip.plannedWhen,
  });

  return (
    <>
      <ThemeProvider
        theme={getWhiteLineTheme(
          checkIn.trip.line.id,
          checkIn.trip.line.product
        )}
      >
        <section className={styles.base}>
          <ThemeProvider
            theme={getLineTheme(
              checkIn.trip.line.id,
              checkIn.trip.line.product
            )}
          >
            <header className={styles.header}>
              <LineIndicator
                isInverted
                lineId={checkIn.trip.line.id}
                lineName={checkIn.trip.line.name}
                product={checkIn.trip.line.product}
                productName=""
              />

              <span>{checkIn.trip.direction}</span>
            </header>
          </ThemeProvider>

          <Route>
            <Route.Entry lineSlot={<Route.Line variant="default" />}>
              <div className={styles.station}>
                <span>{checkIn.trip.station.name}</span>
                <Route.Time schedule={departureSchedule} type="departure" />
              </div>
              {/* <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  fontWeight: 500,
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                test
              </div> */}
            </Route.Entry>

            <Route.Entry>
              <div className={styles.station}>
                <span>{checkIn.destination.name}</span>
                <Route.Time schedule={arrivalSchedule} type="arrival" />
              </div>
            </Route.Entry>
          </Route>
        </section>
      </ThemeProvider>

      {hasSubsequentChangeover && (
        <ThemeProvider
          color="#FFF"
          colorRGB="255, 255, 255"
          contrast="red"
          contrastRGB="77, 77, 77"
        >
          <div className={styles.changeover}>
            <MdSwitchAccessShortcut
              size={16}
              style={{
                left: '-1.25rem',
                opacity: '0.5',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%) scaleY(-1)',
              }}
            />

            <Route.Line variant="partial" />

            <div className={styles.content}>
              <TbWalk size={16} />
              <span>Umstieg</span>
            </div>
          </div>
        </ThemeProvider>
      )}
    </>
  );
};

export default LiveCheckInPart;
