import { Overlay } from '@/components/Overlay/Overlay';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { radioCanada } from '@/styles/fonts';
import { AboardTrip } from '@/types/aboard';
import { SelectTripOverlayProps } from './types';

export const SelectTripOverlay = ({
  onComplete,
  ...overlayProps
}: SelectTripOverlayProps) => {
  const { selectTrip } = useCheckIn();

  const handleTripSelected = (trip: AboardTrip) => {
    selectTrip({ trip });
    onComplete();
  };

  return (
    <Overlay {...overlayProps} className={radioCanada.className}>
      <header></header>

      <Overlay.ScrollArea></Overlay.ScrollArea>
    </Overlay>
  );
};
