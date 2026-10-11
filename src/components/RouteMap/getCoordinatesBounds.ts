import type { Coordinate } from './getPolylineCoordinates';

/**
 * Returns the bounding box of the given coordinates as `[west, south, east, north]`.
 */
export function getCoordinatesBounds(coordinates: Coordinate[]) {
  return coordinates.reduce<[number, number, number, number]>(
    ([west, south, east, north], [longitude, latitude]) => [
      Math.min(west, longitude),
      Math.min(south, latitude),
      Math.max(east, longitude),
      Math.max(north, latitude),
    ],
    [Infinity, Infinity, -Infinity, -Infinity],
  );
}
