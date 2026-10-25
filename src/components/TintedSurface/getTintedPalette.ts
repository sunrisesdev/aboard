type Vector3 = [number, number, number];

type StatusKey = 'early' | 'late' | 'onTime' | 'slight';

type StatusColors = Record<StatusKey, string>;

/** Farbe in OKLCH. `lightness` liegt in 0..1 (nicht in Prozent), `hue` in Grad. */
type OklchColor = {
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

export const lightnessStep = 0.005;
const oklchPattern = /^oklch\(\s*(\d*\.?\d+)(%?)\s+(\d*\.?\d+)\s+(none|\d*\.?\d+)(?:deg)?\s*\)$/i;
const shortHexPattern = /^[0-9a-f]{3}$/i;
const hexPattern = /^[0-9a-f]{6}$/i;
const statusColorsCache = new Map<string, StatusColors>();

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function clampVector([first, second, third]: Vector3): Vector3 {
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

function oklabToLinear([lightness, a, b]: Vector3): Vector3 {
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
    throw new Error(`getTintedPalette: Invalid color "${value}", expected #rgb, #rrggbb or oklch(L% C h)`);
  }

  const [red, green, blue] = [0, 2, 4].map((index) => toLinear(Number.parseInt(hex.slice(index, index + 2), 16) / 255));

  return [red, green, blue];
}

/** Relative Luminanz nach WCAG 2.x */
function getLuminance([red, green, blue]: Vector3) {
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function getContrastRatio(firstLuminance: number, secondLuminance: number) {
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
