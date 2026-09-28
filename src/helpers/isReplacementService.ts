import type { DepartureResource, StationResource } from '@/lib/traewelling';

const railLineNamePattern = /^(S|RB|RE|RS|IRE|MEX|FEX|IC|ICE|EC)\s?\d+$/;

// areas and identifiers are typed as required but missing in some API responses.
function isInGermany(station: StationResource) {
  return (
    station.areas?.some(({ adminLevel, name }) => adminLevel === 2 && name === 'Deutschland')
    || station.identifiers?.some(({ type, identifier }) => type === 'ifopt' && identifier.startsWith('de:'))
    || String(station.ibnr ?? '').startsWith('80')
  );
}

export function isReplacementService(departure: DepartureResource) {
  const isRoadVehicle = ['BUS', 'COACH'].includes(departure.line.mode?.toUpperCase() ?? '');

  return isRoadVehicle && railLineNamePattern.test(departure.line.name ?? '') && isInGermany(departure.station);
}
