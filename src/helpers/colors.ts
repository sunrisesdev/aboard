export type Vector3 = [number, number, number];

/** Farbe in OKLCH. `lightness` liegt in 0..1 (nicht in Prozent), `hue` in Grad. */
export type OklchColor = {
  chroma: number;
  hue: number;
  lightness: number;
};

/** Fertige Farbe, deren Messwerte exakt zum CSS-Wert passen. */
export type Color = {
  /** CSS-Wert im Format `oklch(L% C h)` */
  css: string;
  /** OKLCH-Lightness, gerundet wie im CSS-Wert */
  lightness: number;
  /** Relative Luminanz nach WCAG 2.x */
  luminance: number;
  /** Lineares sRGB innerhalb von 0..1 */
  rgb: Vector3;
};

export const lightnessStep = 0.005;
const oklchPattern = /^oklch\(\s*(\d*\.?\d+)(%?)\s+(\d*\.?\d+)\s+(none|\d*\.?\d+)(?:deg)?\s*\)$/i;
const shortHexPattern = /^[0-9a-f]{3}$/i;
const hexPattern = /^[0-9a-f]{6}$/i;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function clampVector([first, second, third]: Vector3): Vector3 {
  return [clamp(first), clamp(second), clamp(third)];
}

function toLinear(channel: number) {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

export function linearToOklab([red, green, blue]: Vector3): Vector3 {
  const long = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const medium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const short = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);

  return [
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short,
    1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short,
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short,
  ];
}

export function oklabToLinear([lightness, a, b]: Vector3): Vector3 {
  const long = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const medium = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const short = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ];
}

export function oklabToLch([lightness, a, b]: Vector3): Vector3 {
  return [lightness, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
}

function lchToOklab(lightness: number, chroma: number, hue: number): Vector3 {
  return [lightness, chroma * Math.cos((hue * Math.PI) / 180), chroma * Math.sin((hue * Math.PI) / 180)];
}

function isInGamut(rgb: Vector3) {
  return rgb.every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);
}

/** Wandelt `#rgb`, `#rrggbb` oder `oklch(L% C h)` in lineares sRGB um (bei `oklch()` ggf. außerhalb von 0..1). */
export function parseColor(value: string): Vector3 {
  const trimmedValue = value.trim();
  const oklchMatch = oklchPattern.exec(trimmedValue);
  if (oklchMatch) {
    const [, lightness, percent, chroma, hue] = oklchMatch;

    return oklabToLinear(
      lchToOklab(
        Number(lightness) / (percent ? 100 : 1),
        Number(chroma),
        hue.toLowerCase() === 'none' ? 0 : Number(hue),
      ),
    );
  }

  let hex = trimmedValue.replace(/^#/, '');
  if (shortHexPattern.test(hex)) hex = [...hex].map((digit) => digit + digit).join('');
  if (!hexPattern.test(hex)) {
    throw new Error(`parseColor: Invalid color "${value}", expected #rgb, #rrggbb or oklch(L% C h)`);
  }

  const [red, green, blue] = [0, 2, 4].map((index) => toLinear(Number.parseInt(hex.slice(index, index + 2), 16) / 255));

  return [red, green, blue];
}

/** Relative Luminanz nach WCAG 2.x */
export function getLuminance([red, green, blue]: Vector3) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(firstLuminance: number, secondLuminance: number) {
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

/**
 * Erzeugt eine Farbe aus OKLCH-Werten. Die Chroma wird bei Bedarf reduziert, bis die Farbe in sRGB liegt.
 * @remarks Lightness, Chroma und Hue werden wie im CSS-Wert gerundet, Luminanz und Kontrast beziehen sich auf die
 * gerundeten Werte.
 */
export function createColor(lightness: number, chroma: number, hue: number): Color {
  const roundedLightness = Math.round(clamp(lightness) * 1e4) / 1e4;
  const roundedHue = Math.round((((hue % 360) + 360) % 360) * 100) / 100;
  const toRgb = (value: number) => oklabToLinear(lchToOklab(roundedLightness, value, roundedHue));

  let gamutChroma = chroma;
  while (!isInGamut(toRgb(gamutChroma)) && gamutChroma >= 1e-4) {
    gamutChroma -= 0.002;
  }

  const roundedChroma = gamutChroma < 1e-4 ? 0 : Math.floor(gamutChroma * 1e4) / 1e4;
  const rgb = clampVector(toRgb(roundedChroma));
  const css = `oklch(${Number((roundedLightness * 100).toFixed(2))}% ${roundedChroma} ${roundedChroma === 0 ? 'none' : roundedHue})`;

  return { css, lightness: roundedLightness, luminance: getLuminance(rgb), rgb };
}

/** Luminanzen entlang des Verlaufs, interpoliert in OKLab (wie `linear-gradient(in oklab, …)`). */
export function getGradientLuminances(from: Color, to: Color, steps = 9) {
  const start = linearToOklab(from.rgb);
  const end = linearToOklab(to.rgb);

  return Array.from({ length: steps }, (_, index) => {
    const progress = index / (steps - 1);
    const mixed = start.map((value, channel) => value + (end[channel] - value) * progress) as Vector3;

    return getLuminance(clampVector(oklabToLinear(mixed)));
  });
}

/** Schlechtester Kontrast einer Farbe über alle Luminanzen des Verlaufs. */
export function getWorstContrast(color: Color, luminances: number[]) {
  return Math.min(...luminances.map((luminance) => getContrastRatio(color.luminance, luminance)));
}

/** Verschiebt die Lightness in `direction`, bis die Farbe über den gesamten Verlauf den Mindestkontrast erfüllt. */
export function ensureContrast(
  lightness: number,
  chroma: number,
  hue: number,
  luminances: number[],
  minContrast: number,
  direction: number,
) {
  let color = createColor(lightness, chroma, hue);

  for (let steps = 1; steps <= 200 && getWorstContrast(color, luminances) < minContrast; steps++) {
    color = createColor(lightness + direction * steps * lightnessStep, chroma, hue);
  }

  return color;
}
