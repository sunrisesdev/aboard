import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { Overlay } from '@/components/Overlay/Overlay';
import Route from '@/components/Route/Route';
import { StopSelector } from '@/components/StopSelector/StopSelector';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { Time } from '@/components/Time/Time';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { radioCanada } from '@/styles/fonts';
import { parseSchedule } from '@/utils/parseSchedule';
import styles from './SelectDestination.module.scss';
import { SelectDestinationOverlayProps } from './types';

export const SelectDestinationOverlay = ({
  onComplete,
  ...overlayProps
}: SelectDestinationOverlayProps) => {
  const { state } = useCheckIn();

  const departureStop = state.trip?.stopovers.find(
    (stop) => stop.evaIdentifier === state.origin?.ibnr
  );

  const departureSchedule = parseSchedule({
    actual: departureStop?.departureReal,
    planned: departureStop?.departurePlanned ?? '',
  });

  const theme = getLineTheme(
    state.trip?.number ?? '',
    state.trip?.category ?? 'regional'
  );

  return (
    <Overlay
      {...overlayProps}
      className={radioCanada.className}
      style={{
        backgroundColor: `${theme.accent}`,
      }}
    >
      <ThemeProvider theme={theme}>
        <header className={styles.header}>
          {state.trip && (
            <div className={styles.trip}>
              <LineIndicator
                isInverted
                lineId={state.trip.number}
                lineName={state.trip.lineName}
                product={state.trip.category}
                productName=""
              />
              <span className={styles.direction}>
                {state.trip.destination.name}
              </span>
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
                  type="departure"
                />
              </div>
            </Route.Entry>
          </Route>
        </header>

        <Overlay.ScrollArea>
          <StopSelector
            onSelect={() => void 0}
            stops={
              state.trip?.stopovers.slice(
                state.trip.stopovers.indexOf(departureStop!) + 1
              ) ?? []
            }
          />

          <button onClick={onComplete}>Complete</button>
        </Overlay.ScrollArea>
      </ThemeProvider>
    </Overlay>
  );
};
