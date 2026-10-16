'use client';

import { Drawer } from '@base-ui/react/drawer';
import { clsx } from 'clsx';
import ky from 'ky';
import { useRef, useState } from 'react';
import useSWR from 'swr';
import { BottomDrawer } from '@/components/BottomDrawer/BottomDrawer';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { StationResource } from '@/lib/traewelling';
import { StationSearchItem } from '@/station/StationSearchItem/StationSearchItem';
import { type StationGroup, useStationSuggestions } from '@/station/useStationSuggestions';
import styles from './StationSearchDrawer.module.css';

export function StationSearchDrawer({ triggerClassName }: { triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: stations, isLoading } = useSWR(
    debouncedQuery ? `/api/stations/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    (url: string) => ky.get(url).json<StationResource[]>(),
  );
  const suggestions = useStationSuggestions(open);

  // Without a query, suggestions are offered instead of search results.
  const showsSuggestions = !query;
  const stationGroups: StationGroup[] = showsSuggestions
    ? suggestions
    : stations?.length
      ? [{ id: 'results', items: stations }]
      : [];

  return (
    <BottomDrawer
      initialFocus={searchInputRef}
      open={open}
      onOpenChange={setOpen}
      trigger={<Drawer.Trigger className={clsx(styles.trigger, triggerClassName)}>Station suchen…</Drawer.Trigger>}
    >
      <BottomDrawer.Content className={styles.content}>
        {stationGroups.map((group) => (
          <div key={group.id}>
            {group.label && (
              <p className={styles.label}>
                {group.icon}
                {group.label}
              </p>
            )}

            <ul className={styles.results}>
              {group.items.map((station) => (
                <li key={station.id}>
                  <StationSearchItem station={station} />
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!showsSuggestions && isLoading && <p>Suche läuft…</p>}
        {!showsSuggestions && !isLoading && debouncedQuery && stations?.length === 0 && <p>Keine Treffer.</p>}
      </BottomDrawer.Content>

      <BottomDrawer.Footer>
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Stationsname"
          className={styles.searchInput}
        />
      </BottomDrawer.Footer>
    </BottomDrawer>
  );
}
