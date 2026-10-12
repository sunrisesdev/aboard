// Relative luminance as defined by WCAG 2.x, expects a `#rrggbb` color.
function getRelativeLuminance(hexColor: string) {
  const [red, green, blue] = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hexColor.slice(index, index + 2), 16) / 255;

    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(firstHexColor: string, secondHexColor: string) {
  const [lighter, darker] = [getRelativeLuminance(firstHexColor), getRelativeLuminance(secondHexColor)].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

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
