// Relative luminance as defined by WCAG 2.x, expects a `#rrggbb` color.
function getRelativeLuminance(hexColor: string) {
  const [red, green, blue] = [1, 3, 5].map((index) => {
    const channel = Number.parseInt(hexColor.slice(index, index + 2), 16) / 255;

    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(firstHexColor: string, secondHexColor: string) {
  const [lighter, darker] = [getRelativeLuminance(firstHexColor), getRelativeLuminance(secondHexColor)].sort(
    (first, second) => second - first,
  );

  return (lighter + 0.05) / (darker + 0.05);
}
