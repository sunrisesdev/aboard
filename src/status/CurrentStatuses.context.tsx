'use client';

import ky from 'ky';
import { createContext, type PropsWithChildren, startTransition, useEffect, useEffectEvent, useState } from 'react';
import { getCheckinTimes } from './getCheckinTimes';
import type { CurrentStatuses } from './getCurrentStatuses';

type CurrentStatusesContextValue = {
  currentStatusesPromise: Promise<CurrentStatuses>;
  refresh: () => void;
};

export const CurrentStatusesContext = createContext<CurrentStatusesContextValue | null>(null);

const pollInterval = 60_000;

// Keeps the refresh from landing a moment before the trip starts or ends
const boundaryBuffer = 1_000;

// Refreshes when the active trip starts or ends, and polls in between to pick up delays and check-ins made elsewhere.
// Consumers unwrap the promise with `use()`, refreshes keep showing the previous data while loading.
export const CurrentStatusesProvider = ({
  children,
  currentStatusesPromise: initialPromise,
}: PropsWithChildren<{ currentStatusesPromise: Promise<CurrentStatuses> }>) => {
  const [currentStatusesPromise, setCurrentStatusesPromise] = useState(initialPromise);

  const refresh = () => {
    const nextPromise = ky
      .get('/api/statuses/current')
      .json<CurrentStatuses>()
      .catch((error) => {
        console.error('Refreshing the current statuses failed', error);

        return currentStatusesPromise;
      });

    startTransition(() => setCurrentStatusesPromise(nextPromise));
  };

  // A hidden page skips the refresh, the visibility listener catches up once it's back
  const refreshIfVisible = useEffectEvent(() => {
    if (document.visibilityState === 'visible') {
      refresh();
    }
  });

  useEffect(() => {
    let cancelled = false;
    let timeout: number | undefined;

    currentStatusesPromise.then(({ active }) => {
      if (cancelled) return;

      const { arrival, departure } = active ? getCheckinTimes(active.checkin) : {};
      const boundaryDelays = [departure, arrival]
        .filter((time) => typeof time === 'string')
        .map((time) => Date.parse(time) - Date.now() + boundaryBuffer)
        .filter((delay) => delay > 0);

      timeout = window.setTimeout(refreshIfVisible, Math.min(pollInterval, ...boundaryDelays));
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [currentStatusesPromise]);

  useEffect(() => {
    const handleVisibilityChange = () => refreshIfVisible();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return <CurrentStatusesContext value={{ currentStatusesPromise, refresh }}>{children}</CurrentStatusesContext>;
};
