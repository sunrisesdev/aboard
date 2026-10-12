// E.g. "850 m" or "12,3 km"
export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${Math.round(meters).toLocaleString('de-DE')} m`;
  }

  return `${(meters / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} km`;
}
