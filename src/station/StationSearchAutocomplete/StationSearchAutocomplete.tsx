'use client';

import { Autocomplete } from '@base-ui/react/autocomplete';
import { IconSearch } from '@tabler/icons-react';
import { clsx } from 'clsx';
import ky from 'ky';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';
import { Badge } from '@/components/Badge/Badge';
import type { Structure } from '@/helpers/extend';
import { getStationHref } from '@/helpers/getStationHref';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { StationResource } from '@/lib/traewelling';
import { type StationGroup, useStationSuggestions } from '@/station/useStationSuggestions';
import styles from './StationSearchAutocomplete.module.css';

export const StationSearchAutocomplete = ({ className, ...props }: Structure) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const router = useRouter();

  const suggestions = useStationSuggestions(open);
  const { data: stations, isLoading } = useSWR(
    debouncedQuery ? `/api/stations/search?q=${encodeURIComponent(debouncedQuery)}` : null,
    (url: string) => ky.get(url).json<StationResource[]>(),
  );

  // Without a query, suggestions are offered instead of search results.
  const showsSuggestions = !query;
  const stationGroups: StationGroup[] = showsSuggestions
    ? suggestions
    : stations?.length
      ? [{ id: 'results', items: stations }]
      : [];
  const isSearching = !showsSuggestions && (isLoading || query !== debouncedQuery);
  const status = isSearching
    ? 'Suche läuft…'
    : !showsSuggestions && stations?.length === 0
      ? 'Keine Treffer.'
      : undefined;

  return (
    <Autocomplete.Root
      filter={null}
      itemToStringValue={(station: StationResource) => station.name}
      items={stationGroups}
      onOpenChange={setOpen}
      // Picking a station navigates away, so the input starts empty for the next search.
      onValueChange={(value, { reason }) => setQuery(reason === 'item-press' ? '' : value)}
      open={open}
      openOnInputClick
      value={query}
    >
      <div className={clsx(styles.base, className)} {...props}>
        <IconSearch aria-hidden className={styles.icon} data-via-icon />
        <Autocomplete.Input aria-label="Station suchen" className={styles.input} placeholder="Station suchen…" />
      </div>

      <Autocomplete.Portal hidden={showsSuggestions && !suggestions.length}>
        <Autocomplete.Positioner className={styles.positioner} sideOffset={4}>
          <Autocomplete.Popup aria-busy={isSearching || undefined} className={styles.popup}>
            <Autocomplete.Status>{status && <div className={styles.status}>{status}</div>}</Autocomplete.Status>

            <Autocomplete.List className={styles.list}>
              {(group: StationGroup) => (
                <Autocomplete.Group className={styles.group} items={group.items} key={group.id}>
                  {group.label && (
                    <Autocomplete.GroupLabel className={styles.label}>
                      {group.icon}
                      {group.label}
                    </Autocomplete.GroupLabel>
                  )}

                  <Autocomplete.Collection>
                    {(station: StationResource) => {
                      const rilIdentifier = station.identifiers?.find(
                        ({ type }) => type === 'de_db_ril100',
                      )?.identifier;

                      return (
                        <Autocomplete.Item
                          className={styles.item}
                          key={station.id}
                          onClick={() => router.push(getStationHref(station))}
                          value={station}
                        >
                          <span className={styles.name}>
                            {station.name}
                            {rilIdentifier && <Badge>{rilIdentifier}</Badge>}
                          </span>

                          {!!station.areas?.length && (
                            <span className={styles.areas}>
                              {station.areas
                                .toSorted((a, b) => b.adminLevel - a.adminLevel)
                                .map(({ name }) => name)
                                .join(', ')}
                            </span>
                          )}
                        </Autocomplete.Item>
                      );
                    }}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Popup>
        </Autocomplete.Positioner>
      </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};
