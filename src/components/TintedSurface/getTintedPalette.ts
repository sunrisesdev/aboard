import {
  clampVector,
  createColor,
  getContrastRatio,
  getGradientLuminances,
  getLuminance,
  getWorstContrast,
  lightnessStep,
  linearToOklab,
  type OklchColor,
  oklabToLch,
  parseColor,
} from '@/helpers/colors';

type StatusKey = 'early' | 'late' | 'onTime' | 'slight';

type StatusColors = Record<StatusKey, string>;

type StatusColorOptions = {
  /** Überschreibt einzelne Ausgangsfarben für `surfaceDark`. */
  anchorsDark?: Partial<Record<StatusKey, OklchColor>>;
  /** Überschreibt einzelne Ausgangsfarben für `surfaceLight`. */
  anchorsLight?: Partial<Record<StatusKey, OklchColor>>;
  /**
   * Mindestkontrast (WCAG-Verhältnis) der Statusfarben gegen ihre Fläche.
   * @default 4.5
   */
  minContrast?: number;
  /**
   * Fläche für Statusbadges auf Karten mit dunklem Text. Akzeptiert `#rgb`, `#rrggbb` und `oklch(L% C h)`.
   * @default 'oklch(14.5% 0 none)'
   */
  surfaceDark?: string;
  /**
   * Fläche für Statusbadges auf Karten mit hellem Text. Akzeptiert `#rgb`, `#rrggbb` und `oklch(L% C h)`.
   * @default '#ffffff'
   */
  surfaceLight?: string;
};

type TintedPaletteOptions = {
  /**
   * Stärke des Verlaufs. 0 = einfarbig, 1 = Standard, 2 = doppelt so stark.
   * @default 1
   */
  gradientStrength?: number;
  /**
   * Maximale Verschiebung der OKLCH-Lightness (0..1), um `targetContrast` zu erreichen. Gilt für Grundfarben
   * mit erkennbarer Chroma; je größer der Wert, desto stärker darf die Karte von der Grundfarbe abweichen.
   * @default 0.04
   */
  maxLightnessShift?: number;
  /**
   * Wie `maxLightnessShift`, aber für (nahezu) neutrale Grundfarben wie Grau, Schwarz und Weiß.
   * @default 0.1
   */
  maxLightnessShiftNeutral?: number;
  /**
   * Harter Mindestkontrast für den Primärtext über den gesamten Verlauf. Wird immer erzwungen, notfalls auch
   * über `maxLightnessShift` hinaus.
   * @default 4.5
   */
  minContrast?: number;
  /**
   * Mindestkontrast für den Sekundärtext. Dieser wird so weit vom Primärtext zum Hintergrund hin abgesetzt,
   * bis der Wert gerade noch erreicht ist. Je kleiner der Wert, desto stärker die Abstufung.
   * @default 4.55
   */
  minSecondaryContrast?: number;
  /**
   * Optionen für die Statusfarben, siehe {@link StatusColorOptions}.
   * @default {}
   */
  status?: StatusColorOptions;
  /**
   * Wunschkontrast für den Primärtext. Wird nur angestrebt, solange die Karte dafür höchstens um
   * `maxLightnessShift` bzw. `maxLightnessShiftNeutral` verschoben werden muss.
   * @default 7
   */
  targetContrast?: number;
  /**
   * Textfarbe der Karte. `auto` wählt anhand der Grundfarbe die Variante mit dem besseren Kontrast.
   * @default 'auto'
   */
  textColor?: 'auto' | 'dark' | 'light';
};

export type TintedPalette = {
  /** Fläche für Badges (z. B. Gleis). `foreground` hat darauf mindestens 7:1. */
  badgeBackground: string;
  /**
   * Neutrale Fläche für Badges mit farbigem Statustext (z. B. Verspätung). Folgt der Textfarbe der Karte:
   * heller Text → `status.surfaceLight`, dunkler Text → `status.surfaceDark`. Wird unverändert zurückgegeben.
   */
  contrastBackground: string;
  /** Primärer Vordergrund (Text, Linien). Fast Weiß oder fast Schwarz, leicht getönt. */
  foreground: string;
  /** Sekundärer Vordergrund, abgesetzt, aber über `minSecondaryContrast`. */
  foregroundSecondary: string;
  /** Verlauf: `from` ist die Startfarbe (oben links), `to` die Endfarbe (unten rechts). */
  gradient: { from: string; to: string };
  /** Statusfarben für Text auf `contrastBackground`. Jede erfüllt `status.minContrast` gegen diese Fläche. */
  status: StatusColors;
};

/**
 * Ausgangsfarben der Statusfarben (aus den bisherigen CSS-Variablen). Erfüllt eine Ausgangsfarbe den
 * Mindestkontrast, wird sie (auf sRGB begrenzt) übernommen, sonst wird nur ihre Lightness angepasst.
 */
const defaultStatusAnchors = {
  dark: {
    // biome-ignore lint/suspicious/noApproximativeNumericConstant: Lightness, nur zufällig nahe an √½
    early: { chroma: 0.165, hue: 254.624, lightness: 0.707 },
    late: { chroma: 0.191, hue: 22.216, lightness: 0.704 },
    onTime: { chroma: 0.209, hue: 151.711, lightness: 0.792 },
    slight: { chroma: 0.199, hue: 91.936, lightness: 0.852 },
  },
  light: {
    early: { chroma: 0.245, hue: 262.881, lightness: 0.546 },
    late: { chroma: 0.213, hue: 27.518, lightness: 0.505 },
    onTime: { chroma: 0.154, hue: 150.069, lightness: 0.527 },
    slight: { chroma: 0.179, hue: 58.318, lightness: 0.666 },
  },
};

const statusColorsCache = new Map<string, StatusColors>();

/**
 * Passt die Lightness einer Farbe an, bis sie den Mindestkontrast gegen den Hintergrund erfüllt. Chroma und Hue
 * bleiben erhalten (nur durch sRGB begrenzt).
 * @remarks Gewählt wird die passende Lightness mit der kleinsten Abweichung; bei Gleichstand gewinnt die Richtung mit
 * dem höheren Kontrast. Ist der Mindestkontrast nicht erreichbar, wird der bestmögliche Wert zurückgegeben.
 */
function adjustLightnessForContrast(color: OklchColor, backgroundLuminance: number, minContrast: number) {
  const measure = (lightness: number) => {
    const candidate = createColor(lightness, color.chroma, color.hue);

    return { css: candidate.css, ratio: getContrastRatio(candidate.luminance, backgroundLuminance) };
  };

  let strongest = measure(color.lightness);

  for (let steps = 1; steps <= 200 && strongest.ratio < minContrast; steps++) {
    const candidates = [color.lightness + steps * lightnessStep, color.lightness - steps * lightnessStep]
      .filter((lightness) => lightness >= 0 && lightness <= 1)
      .map(measure);
    if (!candidates.length) break;

    strongest = candidates.reduce((best, candidate) => (candidate.ratio > best.ratio ? candidate : best), strongest);
  }

  return strongest.css;
}

function getStatusColors(anchors: Record<StatusKey, OklchColor>, surface: string, minContrast: number) {
  const cacheKey = JSON.stringify([anchors, surface, minContrast]);
  const cachedColors = statusColorsCache.get(cacheKey);
  if (cachedColors) return cachedColors;

  const surfaceLuminance = getLuminance(clampVector(parseColor(surface)));
  const colors = Object.fromEntries(
    Object.entries(anchors).map(([status, anchor]) => [
      status,
      adjustLightnessForContrast(anchor, surfaceLuminance, minContrast),
    ]),
  ) as StatusColors;
  statusColorsCache.set(cacheKey, colors);

  return colors;
}

/**
 * Leitet aus der Grundfarbe einer Linie ein festes Farbset für eine Karte ab. Der Kontrast wird über den gesamten
 * Verlauf garantiert, nicht nur für die Grundfarbe.
 *
 * Alle Farben werden als `oklch(L% C h)` zurückgegeben und liegen innerhalb von sRGB, sehen also auf jedem Display
 * gleich aus. Einzige Ausnahme ist `contrastBackground`, das so zurückgegeben wird, wie es konfiguriert ist.
 * @param baseColor Grundfarbe der Linie: `#rgb`, `#rrggbb` oder `oklch(L% C h)`
 * @remarks Rein deterministisch und ohne Browser-APIs, damit Server und Client identische Werte erzeugen.
 */
export function getTintedPalette(
  baseColor: string,
  {
    gradientStrength = 1.2,
    maxLightnessShift = 0.04,
    maxLightnessShiftNeutral = 0.1,
    minContrast = 4.5,
    minSecondaryContrast = 4.55,
    status = {},
    targetContrast = 7,
    textColor = 'auto',
  }: TintedPaletteOptions = {},
): TintedPalette {
  const {
    anchorsDark,
    anchorsLight,
    minContrast: minStatusContrast = 4.5,
    surfaceDark = 'oklch(14.5% 0 none)',
    surfaceLight = '#ffffff',
  } = status;

  const baseRgb = parseColor(baseColor);
  const [baseLightness, baseChroma, hue] = oklabToLch(linearToOklab(baseRgb));
  const baseLuminance = getLuminance(clampVector(baseRgb));
  const isNeutral = baseChroma < 0.02;
  const hasLightText =
    textColor === 'auto'
      ? getContrastRatio(1, baseLuminance) > getContrastRatio(0, baseLuminance)
      : textColor === 'light';

  // Fast Weiß bzw. fast Schwarz mit leichtem Tint
  const foreground = hasLightText
    ? createColor(0.985, isNeutral ? 0.004 : 0.012, hue)
    : createColor(0.17, isNeutral ? 0.004 : 0.02, hue);

  // Der Verlauf bewegt sich nur in die Richtung, die den Kontrast zum Text nicht verschlechtert:
  // dunkler bei hellem Text, heller bei dunklem Text.
  const [startOffset, endOffset] = hasLightText
    ? [0.03 * gradientStrength, -0.07 * gradientStrength]
    : [0.05 * gradientStrength, -0.02 * gradientStrength];
  const [startChromaFactor, endChromaFactor] = isNeutral
    ? [1, 1]
    : [1 + (0.95 - 1) * gradientStrength, 1 + (1.12 - 1) * gradientStrength];
  const buildGradient = (shift: number) => {
    const from = createColor(baseLightness + shift + startOffset, baseChroma * startChromaFactor, hue);
    const to = createColor(baseLightness + shift + endOffset, baseChroma * endChromaFactor, hue);

    return { from, luminances: getGradientLuminances(from, to), to };
  };

  const shiftDirection = hasLightText ? -lightnessStep : lightnessStep;
  const shiftLimit = baseChroma < 0.05 ? maxLightnessShiftNeutral : maxLightnessShift;
  let shift = 0;
  let gradient = buildGradient(shift);

  // Wunschkontrast nur innerhalb des Verschiebungslimits anstreben, Mindestkontrast notfalls auch darüber hinaus
  for (let iteration = 0; iteration < 400; iteration++) {
    const worstContrast = getWorstContrast(foreground, gradient.luminances);
    if (worstContrast >= minContrast && (worstContrast >= targetContrast || Math.abs(shift) >= shiftLimit)) break;

    shift += shiftDirection;
    gradient = buildGradient(shift);
  }

  // Vom Primärtext Richtung Hintergrund wandern, solange der Mindestkontrast noch hält
  const secondaryChroma = isNeutral ? 0.012 : 0.035;
  let foregroundSecondary = foreground;

  for (let steps = 1; steps <= 100; steps++) {
    const candidate = createColor(foreground.lightness + steps * shiftDirection, secondaryChroma, hue);
    if (getWorstContrast(candidate, gradient.luminances) < minSecondaryContrast) break;

    foregroundSecondary = candidate;
  }

  // Trägt den Primärtext und hebt sich vom Verlauf ab, bevorzugt dunkel bei hellem Text und umgekehrt
  const createBadgeBackground = (isDark: boolean) =>
    isDark
      ? createColor(
          Math.max(0.14, Math.min(gradient.from.lightness, gradient.to.lightness) - 0.17),
          baseChroma * 0.8,
          hue,
        )
      : createColor(
          Math.min(0.975, Math.max(gradient.from.lightness, gradient.to.lightness) + 0.14),
          isNeutral ? 0.004 : baseChroma * (hasLightText ? 0.5 : 0.18),
          hue,
        );

  let badgeBackground = createBadgeBackground(hasLightText);
  if (
    getWorstContrast(badgeBackground, gradient.luminances) < 1.3
    || getContrastRatio(foreground.luminance, badgeBackground.luminance) < 7
  ) {
    // Ausweichrichtung, z. B. bei schwarzen oder weißen Grundfarben
    const alternativeBadgeBackground = createBadgeBackground(!hasLightText);
    if (
      getContrastRatio(foreground.luminance, alternativeBadgeBackground.luminance) >= 7
      && getWorstContrast(alternativeBadgeBackground, gradient.luminances)
        > getWorstContrast(badgeBackground, gradient.luminances)
    ) {
      badgeBackground = alternativeBadgeBackground;
    }
  }

  return {
    badgeBackground: badgeBackground.css,
    contrastBackground: hasLightText ? surfaceLight : surfaceDark,
    foreground: foreground.css,
    foregroundSecondary: foregroundSecondary.css,
    gradient: { from: gradient.from.css, to: gradient.to.css },
    status: hasLightText
      ? getStatusColors({ ...defaultStatusAnchors.light, ...anchorsLight }, surfaceLight, minStatusContrast)
      : getStatusColors({ ...defaultStatusAnchors.dark, ...anchorsDark }, surfaceDark, minStatusContrast),
  };
}
