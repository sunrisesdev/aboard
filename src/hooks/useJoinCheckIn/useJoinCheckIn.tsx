import { CompleteCheckInOverlay } from '@/overlays/CompleteCheckIn/CompleteCheckIn.overlay';
import { SelectDestinationOverlay } from '@/overlays/SelectDestination/SelectDestination.overlay';
import { Status, Trip } from '@/traewelling-sdk/types';
import { useCheckIn } from '../useCheckIn/useCheckIn';
import { useConsecutiveOverlays } from '../useConsecutiveOverlays/useConsecutiveOverlays';

export const useJoinCheckIn = () => {
  const { join, state } = useCheckIn();
  const { completeProps, destinationProps, next, setActive } =
    useConsecutiveOverlays(['destination', 'complete']);

  const handleDestinationComplete = () => {
    next();
  };

  const startOrResume = (status: Status, trip: Trip | undefined) => {
    if (state.trip?.id !== trip?.id) {
      join({ status, trip });
    }

    setActive(true);
  };

  const content = (
    <>
      <SelectDestinationOverlay
        {...destinationProps}
        onBackdropTap={() => setActive(false)}
        onComplete={handleDestinationComplete}
      />

      <CompleteCheckInOverlay
        {...completeProps}
        onBackdropTap={() => setActive(false)}
      />
    </>
  );

  return {
    content,
    startOrResume,
  };
};
