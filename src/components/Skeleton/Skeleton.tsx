import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import styles from './Skeleton.module.css';

/**
 * A pulsing placeholder in the current text color.
 * @param text Stands in for a line of text: sits on the baseline and takes the font's size, so it keeps the line
 * height of the surrounding text. `width` is best given in `ch` then.
 */
export const Skeleton = ({
  className,
  height,
  radius,
  style,
  text = false,
  width,
  ...props
}: Extend<
  Structure,
  {
    height?: CSSProperties['height'];
    radius?: CSSProperties['borderRadius'];
    text?: boolean;
    width?: CSSProperties['width'];
  }
>) => {
  return (
    <span
      aria-hidden
      className={clsx(styles.base, text && styles.text, className)}
      style={{ ...style, borderRadius: radius, height, width }}
      {...props}
    />
  );
};
