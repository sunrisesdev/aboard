import { CSSProperties, useLayoutEffect } from 'react';

const useAccentColor = (color: CSSProperties['color']) => {
  useLayoutEffect(() => {
    document.body.style.setProperty('--accent-color', color ?? '');

    return () => {
      document.body.style.removeProperty('--accent-color');
    };
  });
};

export default useAccentColor;
