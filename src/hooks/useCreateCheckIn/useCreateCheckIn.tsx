import { CompleteCheckInOverlay } from '@/overlays/CompleteCheckIn/CompleteCheckIn.overlay';
import { SelectDestinationOverlay } from '@/overlays/SelectDestination/SelectDestination.overlay';
import { SelectOriginOverlay } from '@/overlays/SelectOrigin/SelectOrigin.overlay';
import { SelectTripOverlay } from '@/overlays/SelectTrip/SelectTrip.overlay';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useCheckIn } from '../useCheckIn/useCheckIn';
import { useConsecutiveOverlays } from '../useConsecutiveOverlays/useConsecutiveOverlays';

export const useCreateCheckIn = () => {
  const {} = useCheckIn();
  const router = useRouter();
  const { data: session } = useSession();

  const {
    completeProps,
    destinationProps,
    next,
    originProps,
    setActive,
    tripProps,
  } = useConsecutiveOverlays(['origin', 'trip', 'destination', 'complete']);

  const handleStepComplete = () => {
    next();
  };

  const startOrResume = () => {
    setActive(true);
  };

  const inputRef = useCallback((inputElement: HTMLInputElement) => {
    inputElement?.focus();
  }, []);

  const content = (
    <>
      <SelectOriginOverlay
        {...originProps}
        onBackdropTap={() => setActive(false)}
        onComplete={handleStepComplete}
        ref={inputRef}
      />

      <SelectTripOverlay
        {...tripProps}
        onBackdropTap={() => setActive(false)}
        onComplete={handleStepComplete}
      />

      <SelectDestinationOverlay
        {...destinationProps}
        onBackdropTap={() => setActive(false)}
        onComplete={handleStepComplete}
      />

      <CompleteCheckInOverlay
        {...completeProps}
        onBackdropTap={() => setActive(false)}
        onComplete={() => void 0}
      />
    </>
  );

  return {
    content,
    startOrResume,
  };
};
