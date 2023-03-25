import { CSSProperties, useLayoutEffect } from 'react';

const useAppTheme = (color: CSSProperties['color']) => {
  useLayoutEffect(() => {
    document.body.style.setProperty('--app-theme', color ?? '');

    return () => {
      document.body.style.removeProperty('--app-theme');
    };
  });
};

export default useAppTheme;
