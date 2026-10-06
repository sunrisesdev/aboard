type Size = { height: number; width: number };

const gap = 8;
const margin = 4;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

/**
 * Positions a label above or below its point, so that it stays fully within the frame where possible.
 * @param preferAbove Whether the label should be placed above the point, if it fits there.
 * @returns The label's top-left corner relative to the frame.
 */
export function getRouteMapLabelPosition({
  frame,
  label,
  point,
  preferAbove,
}: {
  frame: Size;
  label: Size;
  point: { x: number; y: number };
  preferAbove: boolean;
}) {
  const above = point.y - gap - label.height;
  const below = point.y + gap;
  const fitsAbove = above >= margin;
  const fitsBelow = below + label.height <= frame.height - margin;
  const top = (preferAbove && fitsAbove) || !fitsBelow ? above : below;

  return {
    left: clamp(point.x - label.width / 2, margin, frame.width - label.width - margin),
    top: clamp(top, margin, frame.height - label.height - margin),
  };
}
