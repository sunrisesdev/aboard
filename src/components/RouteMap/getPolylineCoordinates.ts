import type { Polyline } from '@/lib/traewelling';

export type Coordinate = [longitude: number, latitude: number];

function isCoordinate(value: unknown): value is Coordinate {
  return Array.isArray(value) && Number.isFinite(value[0]) && Number.isFinite(value[1]);
}

export function getPolylineCoordinates(polyline: Polyline) {
  if (polyline.geometry.type !== 'LineString') return;

  return (polyline.geometry.coordinates ?? []).filter(isCoordinate);
}
