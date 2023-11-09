import { PRODUCT_ICONS } from '@/components/CheckIn/consts';
import LineIndicator from '@/components/LineIndicator/LineIndicator';
import { StopSelector } from '@/components/StopSelector/StopSelector';
import ThemeProvider from '@/components/ThemeProvider/ThemeProvider';
import { getLineTheme } from '@/helpers/getLineTheme/getLineTheme';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import { MotionValue, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
                'linear-gradient(to bottom, #0000, var(--blackA9))',
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
  const [contentHeight, setContentHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const ref = useRef<HTMLElement | null>(null);
  const { state, selectDestination } = useCheckIn();

  useEffect(() => {
    if (disableScroll) ref.current?.scrollTo({ behavior: 'smooth', top: 0 });
  }, [disableScroll]);

  useEffect(() => {
    if (!ref.current || !wrapperRef.current) {
      return;
    }

    const root = wrapperRef.current;
    const viewport = ref.current;
    const content = viewport.children.item(0)!;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (
          entry.target.hasAttribute('data-viewport') &&
          entry.target.clientHeight !== viewportHeight
        ) {
          setViewportHeight(entry.target.clientHeight);
        } else if (
          !entry.target.hasAttribute('data-viewport') &&
          entry.target.scrollHeight !== contentHeight
        ) {
          setContentHeight(entry.target.scrollHeight);
        }
      }
    });

    const handleScroll = () => {
      if (viewport.scrollTop <= 0) {
        root.style.setProperty('--top-fog-opacity', '0');
      } else if (root.style.getPropertyValue('--top-fog-opacity') !== '1') {
        root.style.setProperty('--top-fog-opacity', '1');
      }

      if (viewport.clientHeight + viewport.scrollTop >= viewport.scrollHeight) {
        root.style.setProperty('--bottom-fog-opacity', '0');
      } else if (root.style.getPropertyValue('--bottom-fog-opacity') !== '1') {
        root.style.setProperty('--bottom-fog-opacity', '1');
      }
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    observer.observe(viewport);
    observer.observe(content);

    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      observer.unobserve(viewport);
      observer.unobserve(content);
    };
  }, [contentHeight, ref, viewportHeight, wrapperRef]);

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
          ref={ref}
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
