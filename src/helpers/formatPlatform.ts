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

const normalizePlatform = (platform: string | null | undefined) =>
  platform?.trim().replace(existingPrefixPattern, '').trim() || undefined;

/**
 * @param planned When it differs from `platform`, it's appended as "statt …" (e.g. "Gleis 3a statt 3").
 */
export function formatPlatform(
  platform: string | null | undefined,
  mode: string | null | undefined,
  { abbreviate = false, planned }: { abbreviate?: boolean; planned?: string | null } = {},
) {
  const value = normalizePlatform(platform);

  if (!value) {
    return undefined;
  }

  const plannedValue = normalizePlatform(planned);
  const valueWithChange = plannedValue && plannedValue !== value ? `${value} statt ${plannedValue}` : value;
  const upperCaseMode = mode?.toUpperCase() ?? '';

  if (railBoundModes.has(upperCaseMode)) {
    return `${abbreviate ? 'Gl.' : 'Gleis'} ${valueWithChange}`;
  }

  if (roadModes.has(upperCaseMode)) {
    return `${abbreviate ? 'Stg.' : 'Steig'} ${valueWithChange}`;
  }

  return valueWithChange;
}
