import type { MotisMode } from '@/lib/traewelling';
import {
  createColor,
  ensureContrast,
  getContrastRatio,
  getLuminance,
  linearToOklab,
  oklabToLch,
  parseColor,
} from './colors';

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

// WCAG 2.x SC 1.4.11, since the tinted color tells the trips apart
const minimumTintedContrastRatio = 3;

// Lower than SC 1.4.11 requires, since the neutral color is purely decorational
const minimumNeutralContrastRatio = 2.5;

// OKLCH lightness of the light and dark value of --via-bg-primary in globals.css
const backgrounds = [
  { direction: -1, luminance: createColor(1, 0, 0).luminance },
  { direction: 1, luminance: createColor(0.205, 0, 0).luminance },
];

/**
 * Line color for the light and dark background, as `light-dark()` values. Expects a `#rrggbb` color.
 * - `tinted` only moves the lightness away from the background, so the line keeps its hue.
 * - `neutral` keeps the line color if it has enough contrast and falls back to --via-fg-primary otherwise.
 */
export function getLineContrastColors(hexColor: string | undefined) {
  if (!hexColor) {
    return { neutral: 'var(--via-fg-primary)', tinted: 'var(--via-fg-primary)' };
  }

  const rgb = parseColor(hexColor);
  const luminance = getLuminance(rgb);
  const [lightness, chroma, hue] = oklabToLch(linearToOklab(rgb));

  const [neutralLight, neutralDark] = backgrounds.map((background) =>
    getContrastRatio(luminance, background.luminance) >= minimumNeutralContrastRatio
      ? hexColor
      : 'var(--via-fg-primary)',
  );
  const [tintedLight, tintedDark] = backgrounds.map(
    ({ direction, luminance }) =>
      ensureContrast(lightness, chroma, hue, [luminance], minimumTintedContrastRatio, direction).css,
  );

  return {
    neutral: `light-dark(${neutralLight}, ${neutralDark})`,
    tinted: `light-dark(${tintedLight}, ${tintedDark})`,
  };
}
