import 'maplibre-gl/dist/maplibre-gl.css';
import { getVersion, Map as MapLibreMap, setWorkerUrl } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { buildRouteMapStyle, type RouteMapColors, type RouteMapRoute, type RouteMapStop } from './buildRouteMapStyle';
import { getCoordinatesBounds } from './getCoordinatesBounds';
import { getRouteMapLabelPosition } from './getRouteMapLabelPosition';
import styles from './RouteMap.module.css';
import { resolveCssColor } from './resolveCssColor';

export type RouteMapStatus = 'loading' | 'ready' | 'failed';

// Copied there on install by scripts/copy-maplibre-worker.mjs, since Turbopack can't resolve the worker on its own
setWorkerUrl(`/vendor/maplibre/${getVersion()}/maplibre-gl-worker.mjs`);

const colorVariables: Record<keyof RouteMapColors, string> = {
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

// Kept free at the bottom, so the attribution never covers the routes or a label
const attributionHeight = 44;
// Stops need room for their labels, routes without stops only for the line itself
const stopsPadding = 32;
const routesPadding = 12;
const loadTimeout = 8000;

// Registered as lengths in RouteMap.module.css, so they are computed in pixels
function getInsets(container: HTMLElement) {
  const style = getComputedStyle(container);

  return {
    left: Number.parseFloat(style.getPropertyValue('--via-route-map-inset-left')) || 0,
    right: Number.parseFloat(style.getPropertyValue('--via-route-map-inset-right')) || 0,
  };
}

function getFitBoundsOptions(padding: number, insets: { left: number; right: number }) {
  return {
    animate: false,
    maxZoom: 15,
    padding: {
      bottom: padding + attributionHeight,
      left: padding + insets.left,
      right: padding + insets.right,
      top: padding,
    },
  };
}

export const RouteMapCanvas = ({
  highlightedRoute,
  onStatusChange,
  routes,
  stops,
}: {
  highlightedRoute?: number;
  onStatusChange: (status: RouteMapStatus) => void;
  routes: RouteMapRoute[];
  stops?: RouteMapStop[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  // Read through refs, so a changed highlight only updates the style and camera instead of recreating the map
  const highlightedRouteRef = useRef(highlightedRoute);
  const updateHighlightRef = useRef<() => void>(undefined);

  useEffect(() => {
    highlightedRouteRef.current = highlightedRoute;
    updateHighlightRef.current?.();
  }, [highlightedRoute]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getStyle = () => {
      const colors = Object.fromEntries(
        Object.entries(colorVariables).map(([key, variable]) => [key, resolveCssColor(container, `var(${variable})`)]),
      ) as RouteMapColors;

      return buildRouteMapStyle({
        colors,
        highlightedRoute: highlightedRouteRef.current,
        routes: routes.map((route) => ({
          ...route,
          color: resolveCssColor(container, route.color),
          highlightColor: route.highlightColor && resolveCssColor(container, route.highlightColor),
        })),
        stops,
      });
    };

    // Zoomed to the highlighted route, if it can be drawn
    const getBounds = () => {
      const highlightedCoordinates = routes[highlightedRouteRef.current ?? -1]?.coordinates;

      return getCoordinatesBounds(
        highlightedCoordinates && highlightedCoordinates.length >= 2
          ? highlightedCoordinates
          : routes.flatMap(({ coordinates }) => coordinates),
      );
    };
    // Read on every fit, since the insets may depend on the viewport
    const getFitBoundsOptionsForContainer = () =>
      getFitBoundsOptions(stops?.length ? stopsPadding : routesPadding, getInsets(container));

    // A removed map (e.g. by Strict Mode's double mount) may still emit errors for its aborted requests
    let isActive = true;
    let isLoaded = false;
    const setStatus = (status: RouteMapStatus) => {
      if (isActive) onStatusChange(status);
    };

    let map: MapLibreMap;
    try {
      map = new MapLibreMap({
        attributionControl: { compact: true },
        bounds: getBounds(),
        canvasContextAttributes: { antialias: true },
        container,
        fitBoundsOptions: getFitBoundsOptionsForContainer(),
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

    const fitRoute = (animate = false) => {
      map.fitBounds(getBounds(), { ...getFitBoundsOptionsForContainer(), animate });
    };

    const positionLabels = () => {
      const labelElements = labelsRef.current?.children;
      if (!stops || !labelElements) return;

      // Labels are kept out of the insets, just like the route
      const insets = getInsets(container);
      const frame = {
        height: container.clientHeight - attributionHeight,
        width: container.clientWidth - insets.left - insets.right,
      };
      const points = stops.map((stop) => {
        const { x, y } = map.project(stop.coordinates);
        return { x: x - insets.left, y };
      });
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
        element.style.translate = `${left + insets.left}px ${top}px`;
      });
    };

    map.once('load', () => {
      isLoaded = true;
      clearTimeout(timeout);
      // The container may have changed its size since the initial fit
      fitRoute();
      positionLabels();
      setStatus('ready');
    });
    // Covers style and tile errors, including rate limiting and network failures. Once loaded, a failed tile (e.g.
    // after zooming to a highlighted route) only leaves a gap, so the map is kept.
    map.on('error', ({ error }) => {
      console.warn('RouteMap failed', error);
      if (!isLoaded) setStatus('failed');
    });
    map.on('resize', () => fitRoute());
    // Keeps the labels on their stops during animated camera changes
    map.on('move', positionLabels);

    // MapLibre diffs the style, so only the changed layers and sources are updated
    const updateStyle = () => map.setStyle(getStyle());

    updateHighlightRef.current = () => {
      updateStyle();
      fitRoute(!matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    const colorScheme = matchMedia('(prefers-color-scheme: dark)');
    colorScheme.addEventListener('change', updateStyle);

    return () => {
      isActive = false;
      updateHighlightRef.current = undefined;
      clearTimeout(timeout);
      colorScheme.removeEventListener('change', updateStyle);
      map.remove();
    };
  }, [onStatusChange, routes, stops]);

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
