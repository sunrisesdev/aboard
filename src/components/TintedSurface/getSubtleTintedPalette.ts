import {
  type Color,
  createColor,
  getGradientLuminances,
  getWorstContrast,
  lightnessStep,
  linearToOklab,
  oklabToLch,
  parseColor,
} from './getTintedPalette';

type SubtleTintedPaletteOptions = {
  /**
   * Mindestkontrast für den Primärtext über den gesamten Verlauf.
   * @default 4.5
   */
  minContrast?: number;
  /**
   * Mindestkontrast für den Sekundärtext über den gesamten Verlauf.
   * @default 4.5
   */
  minSecondaryContrast?: number;
};

/** Alle Werte im Format `light-dark(oklch(…), oklch(…))`. */
export type SubtleTintedPalette = {
  /** Primärer Vordergrund, die Grundfarbe selbst. Nur in der Lightness angepasst, falls der Kontrast nicht reicht. */
  foreground: string;
  /** Sekundärer Vordergrund, getöntes Grau im Farbton der Grundfarbe. */
  foregroundSecondary: string;
  /** Verlauf: `from` ist die Startfarbe (oben links), `to` die Endfarbe (unten rechts). */
  gradient: { from: string; to: string };
};

/** Wie bei `getTintedPalette` ist `from` heller als `to`. */
const schemes = {
  dark: { chromaFactor: 0.3, from: 0.29, maxChroma: 0.06, secondaryLightness: 0.78, to: 0.24 },
  light: { chromaFactor: 0.15, from: 0.98, maxChroma: 0.03, secondaryLightness: 0.45, to: 0.95 },
};

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

/**
 * Gegenstück zu `getTintedPalette`: Die Grundfarbe wird zum Primärtext, der Hintergrund ist im Light Mode ein heller
 * und im Dark Mode ein dunkler Ton derselben Farbe.
 * @param baseColor Grundfarbe: `#rgb`, `#rrggbb` oder `oklch(L% C h)`
 * @remarks Rein deterministisch und ohne Browser-APIs, damit Server und Client identische Werte erzeugen.
 */
export function getSubtleTintedPalette(
  baseColor: string,
  { minContrast = 4.5, minSecondaryContrast = 4.5 }: SubtleTintedPaletteOptions = {},
): SubtleTintedPalette {
  const [baseLightness, baseChroma, hue] = oklabToLch(linearToOklab(parseColor(baseColor)));
  const isNeutral = baseChroma < 0.02;

  const [light, dark] = (['light', 'dark'] as const).map((scheme) => {
    const { chromaFactor, from, maxChroma, secondaryLightness, to } = schemes[scheme];
    // Neutrale Grundfarben bleiben (nahezu) neutral, statt einen zufälligen Farbton zu bekommen
    const tintChroma = isNeutral ? Math.min(baseChroma, 0.004) : Math.min(baseChroma * chromaFactor, maxChroma);
    const gradient = { from: createColor(from, tintChroma, hue), to: createColor(to, tintChroma, hue) };
    const luminances = getGradientLuminances(gradient.from, gradient.to);
    // Weg vom Hintergrund: dunkler im Light Mode, heller im Dark Mode
    const direction = scheme === 'light' ? -1 : 1;

    return {
      foreground: ensureContrast(baseLightness, baseChroma, hue, luminances, minContrast, direction),
      foregroundSecondary: ensureContrast(
        secondaryLightness,
        isNeutral ? tintChroma : 0.03,
        hue,
        luminances,
        minSecondaryContrast,
        direction,
      ),
      gradient,
    };
  });

  const lightDark = (lightColor: Color, darkColor: Color) => `light-dark(${lightColor.css}, ${darkColor.css})`;

  return {
    foreground: lightDark(light.foreground, dark.foreground),
    foregroundSecondary: lightDark(light.foregroundSecondary, dark.foregroundSecondary),
    gradient: {
      from: lightDark(light.gradient.from, dark.gradient.from),
      to: lightDark(light.gradient.to, dark.gradient.to),
    },
  };
}
