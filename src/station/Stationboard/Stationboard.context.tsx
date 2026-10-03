'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, type PropsWithChildren, useOptimistic, useTransition } from 'react';
import type { TravelType } from '@/lib/traewelling';

type StationboardFilters = {
  requestedTime: string | undefined;
  travelType: TravelType | undefined;
};

type StationboardContextValue = StationboardFilters & {
  changeRequestedTime: (requestedTime: string | undefined) => void;
  changeTravelType: (travelType: TravelType | undefined) => void;
  isPending: boolean;
};

export const StationboardContext = createContext<StationboardContextValue | null>(null);

export const StationboardContextProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [filters, setOptimisticFilters] = useOptimistic<StationboardFilters>({
    requestedTime: searchParams.get('at') ?? undefined,
    travelType: (searchParams.get('travelType') as TravelType | null) ?? undefined,
  });

  const changeFilters = (changes: Partial<StationboardFilters>) => {
    const nextFilters = { ...filters, ...changes };
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextFilters.requestedTime) {
      nextSearchParams.set('at', nextFilters.requestedTime);
    } else {
      nextSearchParams.delete('at');
    }

    if (nextFilters.travelType) {
      nextSearchParams.set('travelType', nextFilters.travelType);
    } else {
      nextSearchParams.delete('travelType');
    }

    const query = nextSearchParams.toString();

    startTransition(() => {
      setOptimisticFilters(nextFilters);
      // Always replace, so filter changes don't pile up in the browser history.
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <StationboardContext
      value={{
        ...filters,
        changeRequestedTime: (requestedTime) => changeFilters({ requestedTime }),
        changeTravelType: (travelType) => changeFilters({ travelType }),
        isPending,
      }}
    >
      {children}
    </StationboardContext>
  );
};
