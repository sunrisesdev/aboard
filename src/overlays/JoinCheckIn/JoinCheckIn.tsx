import { PRODUCT_ICONS } from '@/components/CheckIn/consts';
import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { StopSelector } from '@/components/StopSelector/StopSelector';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { useOverlayScroll } from '@/hooks/useOverlayScroll/useOverlayScroll';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { MotionValue, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Sheet, { SheetRef } from 'react-modal-sheet';
import styles from './JoinCheckIn.module.scss';
import { JoinCheckInOverlayProps } from './types';

const SHEET_HEADER_HEIGHT = 40;

export const JoinCheckInOverlay = ({
  isActive,
  setActive,
}: JoinCheckInOverlayProps) => {
  const [backdropStyle, setBackdropStyle] = useState<
    'clear' | 'partial' | 'full'
  >('clear');
  const [isExpanded, setExpanded] = useState(false);
  const ref = useRef<SheetRef>();

  const { state } = useCheckIn();

  const handleOnSnap = (index: number) => {
    setBackdropStyle((['full', 'partial', 'clear'] as const)[index]);
    setExpanded(index === 0);
  };

  const theme =
    state.trip && getLineTheme(state.trip.number, state.trip.category);

  return (
    <Sheet
      // detent="content-height"
      initialSnap={1}
      isOpen={isActive}
      onClose={() => ref.current?.snapTo(2)}
      onSnap={handleOnSnap}
      ref={ref}
      snapPoints={[-16, 1 / 3, SHEET_HEADER_HEIGHT + 34]}
    >
      <ThemeProvider theme={theme}>
        <Sheet.Container
          className={styles.base}
          style={
            state.trip && {
              backgroundColor: 'var(--accent)',
            }
          }
        >
          <Sheet.Header />

          <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
            <DestinationContent
              disableScroll={!isExpanded}
              y={ref.current?.y}
            />
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop
          className={styles.overlay}
          onTap={() => setActive(false)}
        >
          <motion.div
            animate={{
              opacity: backdropStyle === 'clear' ? 0 : 1,
            }}
            style={{
              alignSelf: 'flex-start',
              backgroundImage:
                'linear-gradient(to bottom, #0000, var(--black-a9))',
              boxSizing: 'content-box',
              height: ref.current?.y,
              paddingBottom: '48px',
              width: '100%',
            }}
          />
        </Sheet.Backdrop>
      </ThemeProvider>
    </Sheet>
  );
};

const DestinationContent = ({
  disableScroll = false,
  y,
}: {
  disableScroll?: boolean;
  y?: MotionValue<number>;
}) => {
  const { contentHeight, scrollerRef, viewportHeight, wrapperRef } =
    useOverlayScroll({
      disableScroll,
    });

  const { state, selectDestination } = useCheckIn();

  const firstStop = state.trip?.stopovers.find(
    (stop) => stop.evaIdentifier === state.origin?.ibnr
  );

  const availableStops = state.trip?.stopovers.slice(
    state.trip!.stopovers.indexOf(firstStop!) + 1
  );

  const schedule = parseSchedule({
    planned: firstStop?.departurePlanned ?? '',
    actual: firstStop?.departureReal,
  });

  return (
    <>
      <header className={styles.header}>
        {state.trip && (
          <div className={styles.train}>
            <div className={styles.lineName}>
              {PRODUCT_ICONS[state.trip.category]({
                className: styles.productIcon,
              })}

              <LineIndicator
                isInverted
                lineId={state.trip.number}
                lineName={state.trip.lineName}
                product={state.trip.category}
                productName=""
              />
            </div>

            <span>{state.trip.destination.name}</span>
          </div>
        )}

        <div className={styles.origin}>
          <div className={styles.station}>
            <div>{state.origin!.name}</div>
            <span className={styles.time}>
              ab {schedule.planned}
              {!schedule.isOnTime && (
                <span className={styles.delay}>
                  &nbsp;<sup>+{schedule.delayInMinutes}</sup>
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      <div
        className={clsx(
          styles.scrollWrapper,
          contentHeight > viewportHeight && styles.hasFog
        )}
        ref={wrapperRef}
      >
        <Sheet.Scroller
          className={styles.scrollArea}
          draggableAt="top"
          ref={scrollerRef}
          style={{
            overflowX: 'hidden',
            overflowY: disableScroll ? 'hidden' : 'unset',
          }}
        >
          <StopSelector
            onSelect={(stop) => selectDestination({ destination: stop })}
            stops={availableStops ?? []}
          />
        </Sheet.Scroller>
      </div>
    </>
  );
};
