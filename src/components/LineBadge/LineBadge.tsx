import type { CSSProperties } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import { getColorsByMotisMode } from '@/helpers/getColorsByMotisMode';
import type { MotisMode } from '@/lib/traewelling';
import styles from './LineBadge.module.css';

const hiddenProductNames = ['Bus', 'Fäh', 'STB', 'STR'];
const hiddenProductNamePattern = new RegExp(`^(${hiddenProductNames.join('|')})(.)`, 'gi');

const colorsByMotisMode: Partial<Record<MotisMode, [string, string]>> = {
  AIRPLANE: ['#008984', '#FFF'],
  BUS: ['#6E368C', '#FFF'],
  COACH: ['#DB0078', '#FFF'],
  FERRY: ['#0087B9', '#FFF'],
  HIGHSPEED_RAIL: ['#282D37', '#FFF'],
  LONG_DISTANCE: ['#646973', '#FFF'],
  METRO: ['#1455C0', '#FFF'],
  NIGHT_RAIL: ['#646973', '#FFF'],
  RAIL: ['#646973', '#FFF'],
  REGIONAL_FAST_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  REGIONAL_RAIL: ['#878C96', 'var(--via-neutral-900)'],
  SUBURBAN: ['#408335', '#FFF'],
  SUBWAY: ['#1455C0', '#FFF'],
  TRAM: ['#8C2E46', '#FFF'],
};

const shapeByMotisMode = {
  BUS: 'pill',
  COACH: 'smooth-rectangle',
  REGIONAL_FAST_RAIL: 'smooth-rectangle',
  REGIONAL_RAIL: 'smooth-rectangle',
  SUBURBAN: 'pill',
} as const satisfies Partial<Record<MotisMode, string>>;

function normalizeHexColor(value?: string) {
  if (!value) return;

  const safeHexValue = String(value).replace(/[^0-9a-f]/gi, '');
  if (safeHexValue.length !== 6) return;

  return `#${safeHexValue}`;
}

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
  const modeColors = getColorsByMotisMode(mode) ?? ['var(--via-fg-primary)', 'var(--via-bg-surface)'];

  const background = normalizeHexColor(backgroundColor) ?? modeColors[0];
  const foreground = normalizeHexColor(color) ?? modeColors[1];

  const lineName = !name
    ? journeyNumber
    : name
        .replaceAll(/\(.*?\)/g, '')
        .replaceAll(hiddenProductNamePattern, '$2')
        .trim();

  const shape = (mode && shapeByMotisMode[mode.toUpperCase() as keyof typeof shapeByMotisMode]) ?? 'rectangle';

  return (
    <div
      className={styles.base}
      data-via-shape={shape}
      style={{ ...style, '--via-line-bg': background, '--via-line-fg': foreground } as CSSProperties}
      {...props}
    >
      {lineName ?? '?'}
    </div>
  );
};
