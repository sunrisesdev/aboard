import { CSSProperties } from 'react';
import styles from './Accent.module.scss';
import { AccentProps } from './types';

const Accent = ({
  children,
  color,
  colorRGB,
  contrast,
  contrastRGB,
  theme,
}: AccentProps) => {
  const style = {
    ['--accent']: color ?? theme?.color,
    ['--accent-rgb']: colorRGB ?? theme?.colorRGB,
    ['--contrast']: contrast ?? theme?.contrast,
    ['--contrast-rgb']: contrastRGB ?? theme?.contrastRGB,
  } as CSSProperties;

  return (
    <div className={styles.base} style={style}>
      {children}
    </div>
  );
};

export default Accent;
