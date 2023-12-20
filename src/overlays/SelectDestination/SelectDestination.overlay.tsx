import { NewLineIndicator } from '@/components/NewLineIndicator/NewLineIndicator';
import { Overlay } from '@/components/Overlay/Overlay';
import Route from '@/components/Route/Route';
import { StopoverSelector } from '@/components/StopoverSelector/StopoverSelector';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { Time } from '@/components/Time/Time';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { radioCanada } from '@/styles/fonts';
import { AboardStopover } from '@/types/aboard';
import { parseSchedule } from '@/utils/parseSchedule';
import styles from './SelectDestination.module.scss';
import { SelectDestinationOverlayProps } from './types';

export const SelectDestinationOverlay = ({
  onComplete,
  ...overlayProps
}: SelectDestinationOverlayProps) => {
  const { selectDestination, state } = useCheckIn();

  const departureStop = state.trip?.stopovers?.find(
    (stop) =>
      stop.station.trwlId === state.origin?.trwlId &&
      new Date(stop.departure.planned!).toISOString() ===
        new Date(state.departureTime!).toISOString()
  );

  const departureSchedule = parseSchedule({
    actual: departureStop?.departure.actual,
    planned: departureStop?.departure.planned ?? '',
  });

  const handleDestinationSelected = (destination: AboardStopover) => {
    selectDestination({ destination });
    onComplete();
  };

  return (
    <Overlay
      {...overlayProps}
      className={radioCanada.className}
      style={{
        backgroundColor: `${state.trip?.line.appearance.accentColor}`,
      }}
    >
      <ThemeProvider appearance={state.trip?.line.appearance}>
        <header className={styles.header}>
          {state.trip && (
            <div className={styles.trip}>
              <NewLineIndicator line={state.trip.line} />

              <span className={styles.direction}>{state.trip.designation}</span>
            </div>
          )}

          <Route>
            <Route.Entry
              className={styles.routeStart}
              lineSlot={<Route.Line />}
              stopIndicatorVariant="default"
            >
              <div className={styles.routeContent}>
                <div>{state.origin?.name}</div>

                <Time
                  delayStyle="p+d"
                  schedule={departureSchedule}
                  style={{ marginTop: '0.25rem' }}
                  type="departure"
                />
              </div>
            </Route.Entry>
          </Route>
        </header>

        <Overlay.ScrollArea>
          <StopoverSelector
            onSelect={handleDestinationSelected}
            stopovers={
              state.trip?.stopovers?.slice(
                state.trip.stopovers.indexOf(departureStop!) + 1
              ) ?? []
            }
          />
        </Overlay.ScrollArea>
      </ThemeProvider>
    </Overlay>
  );
};
