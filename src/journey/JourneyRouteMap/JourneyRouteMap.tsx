'use client';

import { useCallback } from 'react';
import type { RouteMapRoute } from '@/components/RouteMap/buildRouteMapStyle';
import type { RouteMapStatus } from '@/components/RouteMap/RouteMapCanvas';
import { RouteMapCard } from '@/components/RouteMap/RouteMapCard';
import { useJourneyHighlight } from '../JourneyHighlight.context';

// A deferred RouteMap of the journey's trips, highlighting the trip selected in the JourneyTimeline
export const JourneyRouteMap = ({ routes }: { routes: (RouteMapRoute & { statusId: number })[] }) => {
  const { highlightedStatusId, setIsMapReady } = useJourneyHighlight();
  const highlightedRoute = routes.findIndex(({ statusId }) => statusId === highlightedStatusId);

  // Stable, since a changed callback would recreate the map
  const handleStatusChange = useCallback(
    (status: RouteMapStatus) => setIsMapReady(status === 'ready'),
    [setIsMapReady],
  );

  return (
    <RouteMapCard
      deferred
      highlightedRoute={highlightedRoute === -1 ? undefined : highlightedRoute}
      onStatusChange={handleStatusChange}
      routes={routes}
    />
  );
};
