/**
 * Resolves any CSS color (including `var()`, `light-dark()` and `oklch()`) to an `rgba()` string
 * as it would be rendered inside of `element`.
 * @remarks Needed for consumers like MapLibre that only understand basic color syntax.
 */
export function resolveCssColor(element: HTMLElement, value: string) {
  const probe = document.createElement('span');
  probe.style.color = value;
  probe.style.display = 'none';
  element.append(probe);
  const computedColor = getComputedStyle(probe).color;
  probe.remove();

  // Browsers keep modern color spaces in computed values, so a canvas is used to convert to sRGB.
  const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!context) return computedColor;

  context.fillStyle = computedColor;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;

  return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
}
