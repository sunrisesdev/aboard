import { inter } from '@/styles/fonts';
import clsx from 'clsx';
import { CSSProperties, useEffect, useRef } from 'react';
import styles from './NewLineIndicator.module.scss';
import { NewLineIndicatorProps } from './types';

export const NewLineIndicator = ({
  line,
  noOutline = false,
}: NewLineIndicatorProps) => {
  const appearanceVars = {
    '--line-background': line.appearance.background,
    '--line-border': line.appearance.border,
    '--line-color': line.appearance.color,
  };

  const hasBorder =
    !!line.appearance.border &&
    line.appearance.border !== line.appearance.background;

  const hasOutline =
    !noOutline &&
    (line.appearance.accentColor === line.appearance.border ||
      (!line.appearance.border &&
        line.appearance.accentColor === line.appearance.background));

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const { height, width } = wrapperRef.current.getBoundingClientRect();

    wrapperRef.current.style.setProperty(
      '--scale-x',
      (Math.ceil(width + 2) / width).toString()
    );
    wrapperRef.current.style.setProperty(
      '--scale-y',
      (Math.ceil(height + 2) / height).toString()
    );
  }, []);

  if (
    ['hexagon', 'trapezoid'].includes(line.appearance.shape ?? '') &&
    hasOutline
  ) {
    return (
      <div
        aboard-shape={line.appearance.shape}
        className={styles.wrapper}
        ref={wrapperRef}
        style={appearanceVars as CSSProperties}
      >
        <div
          aboard-shape={line.appearance.shape}
          className={clsx(inter.className, styles.base)}
        >
          {line.appearance.lineName}
        </div>
      </div>
    );
  }

  return (
    <div
      aboard-shape={line.appearance.shape}
      className={clsx(
        inter.className,
        styles.base,
        hasBorder && styles.hasBorder,
        hasOutline && styles.hasOutline
      )}
      style={appearanceVars as CSSProperties}
    >
      {line.appearance.lineName}
    </div>
  );
};
