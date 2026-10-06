'use client';

import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import type { RouteMapStop } from '@/helpers/buildRouteMapStyle';
import type { Extend, Structure } from '@/helpers/extend';
import type { Coordinate } from '@/helpers/getPolylineCoordinates';
import styles from './RouteMap.module.css';
import type { RouteMapStatus } from './RouteMapCanvas';

// MapLibre is only loaded once a map is actually rendered
const RouteMapCanvas = dynamic(() => import('./RouteMapCanvas').then((module) => module.RouteMapCanvas), {
  ssr: false,
});

/**
 * Static, non-interactive map of a route. Hides itself when the map can't be displayed (e.g. no WebGL, tile errors or rate limiting).
 * @param color Any CSS color, including variables.
 * @param coordinates GeoJSON coordinates (`[longitude, latitude]`) of the route. Should be referentially stable.
 * @param deferred Shows a button instead, so the map (and MapLibre itself) is only loaded on request.
 * @param stops Labeled stops, usually origin and destination. Should be referentially stable.
 */
export const RouteMap = ({
  className,
  color,
  coordinates,
  deferred = false,
  stops,
  ...props
}: Extend<Structure, { color: string; coordinates: Coordinate[]; deferred?: boolean; stops?: RouteMapStop[] }>) => {
  const [isRequested, setIsRequested] = useState(!deferred);
  const [status, setStatus] = useState<RouteMapStatus>('loading');

  if (coordinates.length < 2 || status === 'failed') return null;

  return (
    <div
      className={clsx(styles.base, className)}
      data-via-deferred={deferred || undefined}
      data-via-status={isRequested ? status : 'idle'}
      {...props}
    >
      {isRequested ? (
        <RouteMapCanvas color={color} coordinates={coordinates} onStatusChange={setStatus} stops={stops} />
      ) : (
        <div className={styles.placeholder}>
          <Button onClick={() => setIsRequested(true)} variant="secondary">
            Karte laden
          </Button>
          <p className={styles.notice}>Dabei wird deine IP-Adresse an OpenFreeMap übertragen.</p>
        </div>
      )}
    </div>
  );
};
