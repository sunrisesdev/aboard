import type { MotisMode } from '@/lib/traewelling';

const colorsByMotisMode: Partial<Record<MotisMode, [string, string]>> = {
  AIRPLANE: ['#008984', '#FFF'],
  BUS: ['#6E368C', '#FFF'],
  COACH: ['#DB0078', '#FFF'],
  FERRY: ['#0087B9', '#FFF'],
  HIGHSPEED_RAIL: ['#282D37', '#FFF'],
  LONG_DISTANCE: ['#646973', '#FFF'],
  METRO: ['#1455C0', '#FFF'],
  NIGHT_RAIL: ['#646973', '#FFF'],
  RAIL: ['#646973', '#FFF'],
  REGIONAL_FAST_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  REGIONAL_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  SUBURBAN: ['#408335', '#FFF'],
  SUBWAY: ['#1455C0', '#FFF'],
  TRAM: ['#8C2E46', '#FFF'],
};

function normalizeHexColor(value: string | null | undefined) {
  if (!value) return;

  const safeHexValue = String(value).replace(/[^0-9a-f]/gi, '');
  if (safeHexValue.length !== 6) return;

  return `#${safeHexValue}`;
}

// The line's own colors take precedence over the default colors of its mode
export function getLineColors({
  color,
  mode,
  textColor,
}: {
  color?: string | null;
  mode?: string | null;
  textColor?: string | null;
}) {
  const modeColors = mode ? colorsByMotisMode[mode.toUpperCase() as MotisMode] : undefined;

  return {
    background: normalizeHexColor(color) ?? modeColors?.[0],
    foreground: normalizeHexColor(textColor) ?? modeColors?.[1],
  };
}
