import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { useOverlayScroll } from '@/hooks/useOverlayScroll/useOverlayScroll';
import { Stop } from '@/traewelling-sdk/types';
import { parseSchedule } from '@/utils/parseSchedule';
import clsx from 'clsx';
import Sheet from 'react-modal-sheet';
import { PRODUCT_ICONS } from '../CheckIn/consts';
import LineIndicator from '../LineIndicator/LineIndicator';
import { StopSelector } from '../StopSelector/StopSelector';
import styles from './DestinationContent.module.scss';
import { DestinationContentProps } from './types';

export const DestinationContent = ({
  disableScroll = false,
  onComplete,
}: DestinationContentProps) => {
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

  const handleSelect = (stop: Stop) => {
    selectDestination({ destination: stop });
    onComplete?.();
  };

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
            onSelect={handleSelect}
            stops={availableStops ?? []}
          />
        </Sheet.Scroller>
      </div>
    </>
  );
};
