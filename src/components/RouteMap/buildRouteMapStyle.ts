import type { MapOptions } from 'maplibre-gl';
import type { Coordinate } from './getPolylineCoordinates';

type StyleSpecification = Exclude<MapOptions['style'], string | undefined>;

export type RouteMapColors = {
  boundary: string;
  casing: string;
  land: string;
  park: string;
  rail: string;
  road: string;
  roadMajor: string;
  route: string;
  urban: string;
  water: string;
};

export type RouteMapStop = {
  coordinates: Coordinate;
  name: string;
};

const tilesUrl = 'https://tiles.openfreemap.org/planet';
const attribution =
  '<a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> <a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>';

/**
 * Builds a minimal, label-free MapLibre style based on OpenFreeMap tiles (OpenMapTiles schema) with the route on top.
 * Stops are marked with a dot; without stops, the route's ends are marked instead.
 * @remarks Stop names are rendered as HTML by RouteMap, so they can be kept within the frame.
 */
export function buildRouteMapStyle({
  colors,
  coordinates,
  stops,
}: {
  colors: RouteMapColors;
  coordinates: Coordinate[];
  stops?: RouteMapStop[];
}) {
  const points = stops?.length
    ? stops.map((stop) => stop.coordinates)
    : [coordinates[0], coordinates[coordinates.length - 1]];

  return {
    version: 8,
    sources: {
      openmaptiles: { type: 'vector', url: tilesUrl, attribution },
      route: {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates }, properties: {} },
      },
      stops: {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: points }, properties: {} },
      },
    },
    layers: [
      { id: 'background', type: 'background', paint: { 'background-color': colors.land } },
      {
        id: 'urban',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: [
          'match',
          ['get', 'class'],
          ['residential', 'suburb', 'neighbourhood', 'commercial', 'industrial'],
          true,
          false,
        ],
        paint: { 'fill-color': colors.urban },
      },
      {
        id: 'landcover',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        filter: ['match', ['get', 'class'], ['wood', 'grass', 'wetland'], true, false],
        paint: { 'fill-color': colors.park },
      },
      {
        id: 'park',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: { 'fill-color': colors.park },
      },
      {
        id: 'water',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        filter: ['!=', ['get', 'brunnel'], 'tunnel'],
        paint: { 'fill-color': colors.water },
      },
      {
        id: 'waterway',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        minzoom: 8,
        filter: ['!=', ['get', 'brunnel'], 'tunnel'],
        paint: { 'line-color': colors.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 2] },
      },
      {
        id: 'boundary',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'boundary',
        filter: ['all', ['==', ['get', 'admin_level'], 2], ['==', ['get', 'maritime'], 0]],
        paint: { 'line-color': colors.boundary, 'line-dasharray': [3, 2], 'line-width': 1 },
      },
      {
        id: 'road',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        minzoom: 9,
        filter: ['match', ['get', 'class'], ['secondary', 'tertiary', 'minor'], true, false],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': colors.road,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 9, 0.5, 14, 3],
        },
      },
      {
        id: 'road-major',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], true, false],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': colors.roadMajor,
          'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], 5, 0.5, 14, 4],
        },
      },
      {
        id: 'rail',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: [
          'all',
          ['match', ['get', 'class'], ['rail', 'transit'], true, false],
          ['!=', ['get', 'brunnel'], 'tunnel'],
        ],
        paint: { 'line-color': colors.rail, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 14, 1.5] },
      },
      {
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': colors.casing, 'line-width': 7 },
      },
      {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': colors.route, 'line-width': 4 },
      },
      {
        id: 'stops',
        type: 'circle',
        source: 'stops',
        paint: {
          'circle-color': colors.casing,
          'circle-radius': 4,
          'circle-stroke-color': colors.route,
          'circle-stroke-width': 2.5,
        },
      },
    ],
  } satisfies StyleSpecification;
}
