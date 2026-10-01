const railBoundModes = new Set([
  'HIGHSPEED_RAIL',
  'LONG_DISTANCE',
  'METRO',
  'NIGHT_RAIL',
  'RAIL',
  'REGIONAL_FAST_RAIL',
  'REGIONAL_RAIL',
  'SUBURBAN',
  'SUBWAY',
  'TRAM',
]);

const roadModes = new Set(['BUS', 'COACH']);

// Prefixes data sources write into the platform value themselves, longest first, optionally abbreviated.
const existingPrefixPattern = /^(?:bahnsteig|bussteig|platform|bsteig|steig|gleis|bstg|stg|gl|pl)(?=[\s.\d]|$)\.?\s*/i;

export function formatPlatform(
  platform: string | null | undefined,
  mode: string | null | undefined,
  { abbreviate = false }: { abbreviate?: boolean } = {},
) {
  const value = platform?.trim().replace(existingPrefixPattern, '').trim();

  if (!value) {
    return undefined;
  }

  const upperCaseMode = mode?.toUpperCase() ?? '';

  if (railBoundModes.has(upperCaseMode)) {
    return `${abbreviate ? 'Gl.' : 'Gleis'} ${value}`;
  }

  if (roadModes.has(upperCaseMode)) {
    return `${abbreviate ? 'Stg.' : 'Steig'} ${value}`;
  }

  return value;
}
