'use client';

import { IconZoomIn, IconZoomOutFilled } from '@tabler/icons-react';
import { Button } from '@/components/Button/Button';
import type { Extend, Structure } from '@/helpers/extend';
import { useJourneyHighlight } from '../JourneyHighlight.context';

// Only shown once the map is ready, since it's loaded on request
export const JourneyHighlightButton = ({ statusId, ...props }: Extend<Structure, { statusId: number }>) => {
  const { highlightedStatusId, isMapReady, toggleHighlight } = useJourneyHighlight();
  if (!isMapReady) return null;

  const isHighlighted = highlightedStatusId === statusId;

  const Icon = isHighlighted ? IconZoomOutFilled : IconZoomIn;
  const label = isHighlighted ? 'Hervorhebung entfernen' : 'Auf der Karte hervorheben';

  return (
    <Button
      aria-label={label}
      aria-pressed={isHighlighted}
      onClick={() => toggleHighlight(statusId)}
      title={label}
      variant="ghost"
      {...props}
    >
      <Icon aria-hidden data-via-icon style={{ fontSize: '1.125rem' }} />
    </Button>
  );
};
