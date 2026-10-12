import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import { getLineColors } from '@/helpers/getLineColors';
import type { MotisMode } from '@/lib/traewelling';
import styles from './LineBadge.module.css';

const hiddenProductNames = ['Bus', 'Fäh', 'STB', 'STR'];
const hiddenProductNamePattern = new RegExp(`^(${hiddenProductNames.join('|')})(.)`, 'gi');

const shapeByMotisMode = {
  BUS: 'pill',
  COACH: 'smooth-rectangle',
  REGIONAL_FAST_RAIL: 'smooth-rectangle',
  REGIONAL_RAIL: 'smooth-rectangle',
  SUBURBAN: 'pill',
} as const satisfies Partial<Record<MotisMode, string>>;

export const LineBadge = ({
  backgroundColor,
  className,
  color,
  journeyNumber,
  mode,
  name,
  productName,
  style,
  ...props
}: Extend<
  Structure,
  {
    backgroundColor?: string;
    color?: string;
    journeyNumber: string | undefined;
    mode: MotisMode | undefined;
    name: string | undefined;
    productName: string | undefined;
  }
>) => {
  const { background = 'var(--via-fg-primary)', foreground = 'var(--via-bg-surface)' } = getLineColors({
    color: backgroundColor,
    mode,
    textColor: color,
  });

  const lineName = !name
    ? journeyNumber
    : name
        .replaceAll(/\(.*?\)/g, '')
        .replaceAll(hiddenProductNamePattern, '$2')
        .trim();

  const shape = (mode && shapeByMotisMode[mode.toUpperCase() as keyof typeof shapeByMotisMode]) ?? 'rectangle';

  return (
    <div
      className={clsx(styles.base, className)}
      data-via-shape={shape}
      style={{ ...style, '--via-line-bg': background, '--via-line-fg': foreground } as CSSProperties}
      {...props}
    >
      {lineName ?? '?'}
    </div>
  );
};
