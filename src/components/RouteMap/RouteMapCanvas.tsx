import 'maplibre-gl/dist/maplibre-gl.css';
import { getVersion, Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { buildRouteMapStyle, type RouteMapColors, type RouteMapStop } from '@/helpers/buildRouteMapStyle';
import { getCoordinatesBounds } from '@/helpers/getCoordinatesBounds';
import type { Coordinate } from '@/helpers/getPolylineCoordinates';
import { getRouteMapLabelPosition } from '@/helpers/getRouteMapLabelPosition';
import { resolveCssColor } from '@/helpers/resolveCssColor';
import styles from './RouteMap.module.css';

export type RouteMapStatus = 'loading' | 'ready' | 'failed';

// Copied there on install by scripts/copy-maplibre-worker.mjs, since Turbopack can't resolve the worker on its own
setWorkerUrl(`/vendor/maplibre/${getVersion()}/maplibre-gl-worker.mjs`);

const colorVariables: Record<Exclude<keyof RouteMapColors, 'route'>, string> = {
  boundary: '--via-route-map-boundary',
  casing: '--via-route-map-casing',
  land: '--via-route-map-land',
  park: '--via-route-map-park',
  rail: '--via-route-map-rail',
  road: '--via-route-map-road',
  roadMajor: '--via-route-map-road-major',
  urban: '--via-route-map-urban',
  water: '--via-route-map-water',
};

const fitBoundsOptions = { animate: false, maxZoom: 15, padding: 32 };
const loadTimeout = 8000;

export const RouteMapCanvas = ({
  color,
  coordinates,
  onStatusChange,
  stops,
}: {
  color: string;
  coordinates: Coordinate[];
  onStatusChange: (status: RouteMapStatus) => void;
  stops?: RouteMapStop[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getStyle = () => {
      const colors = Object.fromEntries(
        Object.entries(colorVariables).map(([key, variable]) => [key, resolveCssColor(container, `var(${variable})`)]),
      ) as Omit<RouteMapColors, 'route'>;

      return buildRouteMapStyle({
        colors: { ...colors, route: resolveCssColor(container, color) },
        coordinates,
        stops,
      });
    };

    const bounds = getCoordinatesBounds(coordinates);

    // A removed map (e.g. by Strict Mode's double mount) may still emit errors for its aborted requests
    let isActive = true;
    const setStatus = (status: RouteMapStatus) => {
      if (isActive) onStatusChange(status);
    };

    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        attributionControl: { compact: true },
        bounds,
        canvasContextAttributes: { antialias: true },
        container,
        fitBoundsOptions,
        interactive: false,
        style: getStyle(),
      });
    } catch (error) {
      // Throws when WebGL is unavailable
      console.warn('RouteMap could not be created', error);
      setStatus('failed');
      return;
    }

    const timeout = setTimeout(() => {
      console.warn('RouteMap did not load in time');
      setStatus('failed');
    }, loadTimeout);

    const fitRoute = () => {
      map.fitBounds(bounds, fitBoundsOptions);

      const labelElements = labelsRef.current?.children;
      if (!stops || !labelElements) return;

      const frame = { height: container.clientHeight, width: container.clientWidth };
      const points = stops.map((stop) => map.project(stop.coordinates));
      const averageY = points.reduce((sum, point) => sum + point.y, 0) / points.length;

      points.forEach((point, index) => {
        const element = labelElements[index];
        if (!(element instanceof HTMLElement)) return;

        const { left, top } = getRouteMapLabelPosition({
          frame,
          label: { height: element.offsetHeight, width: element.offsetWidth },
          point,
          // Places labels on the side facing away from the other stops
          preferAbove: point.y <= averageY,
        });
        element.style.translate = `${left}px ${top}px`;
      });
    };

    map.once('load', () => {
      clearTimeout(timeout);
      // The container may have changed its size since the initial fit
      fitRoute();
      setStatus('ready');
    });
    // Covers style and tile errors, including rate limiting and network failures
    map.on('error', ({ error }) => {
      console.warn('RouteMap failed', error);
      setStatus('failed');
    });
    map.on('resize', fitRoute);

    const colorScheme = matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = () => map.setStyle(getStyle());
    colorScheme.addEventListener('change', handleColorSchemeChange);

    return () => {
      isActive = false;
      clearTimeout(timeout);
      colorScheme.removeEventListener('change', handleColorSchemeChange);
      map.remove();
    };
  }, [color, coordinates, onStatusChange, stops]);

  return (
    <>
      <div className={styles.canvas} ref={containerRef} />
      {stops && (
        <div className={styles.labels} ref={labelsRef}>
          {stops.map((stop, index) => (
            <span className={styles.label} key={index}>
              {stop.name}
            </span>
          ))}
        </div>
      )}
    </>
  );
};
