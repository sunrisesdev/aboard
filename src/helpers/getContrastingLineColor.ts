import { ensureContrast } from '@/components/TintedSurface/getSubtleTintedPalette';
import { createColor, linearToOklab, oklabToLch, parseColor } from '@/components/TintedSurface/getTintedPalette';

// WCAG 2.x SC 1.4.11, since the color tells the trips apart
const minimumContrastRatio = 3;

// OKLCH lightness of the light and dark value of --via-bg-primary in globals.css
const backgrounds = [
  { direction: -1, luminance: createColor(1, 0, 0).luminance },
  { direction: 1, luminance: createColor(0.205, 0, 0).luminance },
];

// Only moves the lightness away from the background, so the line keeps its hue. Expects a `#rrggbb` color.
export function getContrastingLineColor(hexColor: string) {
  const [lightness, chroma, hue] = oklabToLch(linearToOklab(parseColor(hexColor)));
  const [light, dark] = backgrounds.map(
    ({ direction, luminance }) =>
      ensureContrast(lightness, chroma, hue, [luminance], minimumContrastRatio, direction).css,
  );

  return `light-dark(${light}, ${dark})`;
}
