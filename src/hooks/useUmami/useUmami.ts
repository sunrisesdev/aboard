import { useCallback } from 'react';
import { UmamiTrackEventData } from './types';

const useUmami = () => {
  const trackEvent = useCallback(
    (eventName: string, data?: UmamiTrackEventData) => {
      if (typeof window !== undefined) {
        window.umami.trackEvent(eventName, data);
      }
    },
    []
  );

  const trackView = useCallback((url: string) => {
    if (typeof window !== undefined) {
      window.umami.trackView(url);
    }
  }, []);

  return { trackEvent, trackView };
};

export default useUmami;
