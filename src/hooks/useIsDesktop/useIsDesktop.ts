import { useEffect, useState } from 'react';

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const resizeListener = () => {
        setIsDesktop(window.innerWidth >= 600);
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

export default useIsDesktop;
