import colorConvert from 'color-convert';
import { CSSProperties } from 'react';
import styles from './ThemeProvider.module.scss';
import { ThemeProviderProps } from './types';

// TODO: improve!

const ThemeProvider = ({
  appearance,
  children,
  color,
  colorRGB,
  contrast,
  contrastRGB,
  theme,
}: ThemeProviderProps) => {
  const appearanceAccentRGB =
    appearance && colorConvert.hex.rgb(appearance.accentColor!).join(', ');
  const appearanceContrastRGB =
    appearance && colorConvert.hex.rgb(appearance.contrastColor!).join(', ');

  const style = {
    ['--accent']: color ?? appearance?.accentColor ?? theme?.accent,
    ['--accent-rgb']: colorRGB ?? appearanceAccentRGB ?? theme?.accentRGB,
    ['--contrast']: contrast ?? appearance?.contrastColor ?? theme?.contrast,
    ['--contrast-rgb']:
      contrastRGB ?? appearanceContrastRGB ?? theme?.contrastRGB,
  } as CSSProperties;

  return (
    <div className={styles.base} style={style}>
      {children}
    </div>
  );
};

export default ThemeProvider;
