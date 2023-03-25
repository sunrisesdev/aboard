import { CSSProperties } from 'react';
import styles from './ThemeProvider.module.scss';
import { ThemeProviderProps } from './types';

const ThemeProvider = ({
  children,
  color,
  colorRGB,
  contrast,
  contrastRGB,
  theme,
}: ThemeProviderProps) => {
  const style = {
    ['--accent']: color ?? theme?.accent,
    ['--accent-rgb']: colorRGB ?? theme?.accentRGB,
    ['--contrast']: contrast ?? theme?.contrast,
    ['--contrast-rgb']: contrastRGB ?? theme?.contrastRGB,
  } as CSSProperties;

  return (
    <div className={styles.base} style={style}>
      {children}
    </div>
  );
};

export default ThemeProvider;
