import { Overlay } from '@/components/Overlay/Overlay';
import { CompleteCheckInOverlayProps } from './types';

export const CompleteCheckInOverlay = ({
  ...overlayProps
}: CompleteCheckInOverlayProps) => {
  return (
    <Overlay {...overlayProps} withBackdrop>
      F
    </Overlay>
  );
};
