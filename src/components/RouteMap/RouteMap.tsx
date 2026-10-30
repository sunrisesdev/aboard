'use client';

import { IconMapDown } from '@tabler/icons-react';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import type { Extend, Structure } from '@/helpers/extend';
import type { RouteMapRoute, RouteMapStop } from './buildRouteMapStyle';
import styles from './RouteMap.module.css';
import type { RouteMapStatus } from './RouteMapCanvas';

// MapLibre is only loaded once a map is actually rendered
const RouteMapCanvas = dynamic(() => import('./RouteMapCanvas').then((module) => module.RouteMapCanvas), {
  ssr: false,
});

/**
 * Static, non-interactive map of one or more routes. Hides itself when the map can't be displayed (e.g. no WebGL, tile errors or rate limiting).
 * @param deferred Shows a button instead, so the map (and MapLibre itself) is only loaded on request.
 * @param routes Any CSS color (including variables) and GeoJSON coordinates (`[longitude, latitude]`) per route. Should be referentially stable.
 * @param stops Labeled stops, usually origin and destination of a single route. Should be referentially stable.
 */
export const RouteMap = ({
  className,
  deferred = false,
  routes,
  stops,
  ...props
}: Extend<Structure, { deferred?: boolean; routes: RouteMapRoute[]; stops?: RouteMapStop[] }>) => {
  const [isRequested, setIsRequested] = useState(!deferred);
  const [status, setStatus] = useState<RouteMapStatus>('loading');

  if (!routes.some(({ coordinates }) => coordinates.length >= 2) || status === 'failed') return null;

  return (
    <div
      className={clsx(styles.base, className)}
      data-via-deferred={deferred || undefined}
      data-via-status={isRequested ? status : 'idle'}
      {...props}
    >
      {isRequested ? (
        <RouteMapCanvas onStatusChange={setStatus} routes={routes} stops={stops} />
      ) : (
        <div className={styles.placeholder}>
          <Button
            leadingSlot={<IconMapDown aria-hidden data-via-icon />}
            onClick={() => setIsRequested(true)}
            variant="secondary"
          >
            <span>Karte laden</span>
          </Button>

          <div className={styles.notice}>Dabei wird deine IP-Adresse an OpenFreeMap übertragen.</div>
        </div>
      )}
    </div>
  );
};
