import { useEffect, useState } from 'react';

export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeListener = () => {
        setIsDesktop(window.innerWidth >= 768);
      };
      resizeListener();

      window.addEventListener('resize', resizeListener, { passive: true });
      return () => {
        window.removeEventListener('resize', resizeListener);
      };
    }
  }, []);

  return isDesktop;
};
