'use client';

import { IconHistory, IconHome2 } from '@tabler/icons-react';
import ky from 'ky';
import type { ReactNode } from 'react';
import useSWR from 'swr';
import type { StationResource } from '@/lib/traewelling';
import { useUser } from '@/user/useUser';

export type StationGroup = {
  icon?: ReactNode;
  id: string;
  items: StationResource[];
  label?: string;
};

/**
 * The stations offered before the user types a query: the home station (unlabeled), followed by the stations most
 * recently arrived at. Empty groups are left out.
 * @param enabled Defers loading the history until the suggestions are actually shown, e.g. once a search opens.
 */
export function useStationSuggestions(enabled: boolean) {
  const { home } = useUser();
  const { data: history } = useSWR(enabled ? '/api/stations/history' : null, (url: string) =>
    ky.get(url).json<StationResource[]>(),
  );

  const groups: StationGroup[] = [
    { id: 'home', icon: <IconHome2 aria-hidden data-via-icon />, items: home ? [home] : [], label: 'Heimatstation' },
    {
      id: 'history',
      icon: <IconHistory aria-hidden data-via-icon />,
      items: history?.filter(({ id }) => id !== home?.id) ?? [],
      label: 'Zuletzt verwendet',
    },
  ];

  return groups.filter(({ items }) => items.length > 0);
}
