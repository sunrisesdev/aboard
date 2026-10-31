'use client';

import { createContext, type PropsWithChildren, use, useState } from 'react';

type JourneyHighlightContextValue = {
  highlightedStatusId: number | undefined;
  isMapReady: boolean;
  setIsMapReady: (isMapReady: boolean) => void;
  toggleHighlight: (statusId: number) => void;
};

const JourneyHighlightContext = createContext<JourneyHighlightContextValue | null>(null);

// Connects the trips of a JourneyTimeline with the map, which are rendered in different columns of the page
export const JourneyHighlightProvider = ({ children }: PropsWithChildren) => {
  const [highlightedStatusId, setHighlightedStatusId] = useState<number>();
  const [isMapReady, setIsMapReady] = useState(false);

  const toggleHighlight = (statusId: number) => {
    setHighlightedStatusId((current) => (current === statusId ? undefined : statusId));
  };

  return (
    <JourneyHighlightContext value={{ highlightedStatusId, isMapReady, setIsMapReady, toggleHighlight }}>
      {children}
    </JourneyHighlightContext>
  );
};

export function useJourneyHighlight() {
  const context = use(JourneyHighlightContext);

  if (!context) {
    throw new Error('useJourneyHighlight must be used within a JourneyHighlightProvider');
  }

  return context;
}
