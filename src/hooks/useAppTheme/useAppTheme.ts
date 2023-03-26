import { CSSProperties, useLayoutEffect } from 'react';

const useAppTheme = (accent: CSSProperties['color']) => {
  useLayoutEffect(() => {
    document.body.style.setProperty('--app-theme', accent ?? '');

    return () => {
      document.body.style.removeProperty('--app-theme');
    };
  });
};

export default useAppTheme;
