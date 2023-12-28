import { Overlay } from '@/components/Overlay/Overlay';
import { useCheckIn } from '@/hooks/useCheckIn/useCheckIn';
import { radioCanada } from '@/styles/fonts';
import { AboardStation } from '@/types/aboard';
import { SelectOriginOverlayProps } from './types';

export const SelectOriginOverlay = ({
  onComplete,
  ...overlayProps
}: SelectOriginOverlayProps) => {
  const { selectOrigin } = useCheckIn();

  const handleOriginSelected = (origin: AboardStation) => {
    selectOrigin({ origin });
    onComplete();
  };

  return (
    <Overlay {...overlayProps} className={radioCanada.className}>
      <header>Hi</header>

      <Overlay.ScrollArea>
        <div>Hi</div>
      </Overlay.ScrollArea>
    </Overlay>
  );
};
