import { getContrastRatio } from './getContrastRatio';

// WCAG 2.x SC 1.4.11 requires 3:1 for graphical objects like the trip line, but this is purely decorational…
const minimumContrastRatio = 2.5;

export function getLineContrastColor(hexColor: string | undefined) {
  // Hex equivalents of the light and dark value of --via-bg-primary in globals.css.
  const [light, dark] = ['#ffffff', '#171717'].map((backgroundColor) =>
    hexColor && getContrastRatio(hexColor, backgroundColor) >= minimumContrastRatio
      ? hexColor
      : 'var(--via-fg-primary)',
  );

  return `light-dark(${light}, ${dark})`;
}
