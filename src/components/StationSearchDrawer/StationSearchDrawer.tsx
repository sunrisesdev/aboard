"use client";

import { Drawer } from "@base-ui/react/drawer";
import slugify from "@sindresorhus/slugify";
import ky from "ky";
import Link from "next/link";
import { useRef, useState } from "react";
import useSWR from "swr";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { StationResource } from "@/lib/traewelling";
import styles from "./StationSearchDrawer.module.css";

export function StationSearchDrawer() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: stations, isLoading } = useSWR(
    debouncedQuery
      ? `/api/stations/search?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    (url: string) => ky.get(url).json<StationResource[]>(),
  );

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger className={styles.trigger}>Station suchen…</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.backdrop} />
        <Drawer.Viewport className={styles.viewport}>
          <Drawer.Popup className={styles.popup} initialFocus={searchInputRef}>
            <Drawer.Content className={styles.content}>
              {stations && stations.length > 0 && (
                <ul className={styles.results}>
                  {stations.map((station) => (
                    <li key={station.id}>
                      <Link
                        href={`/station/${station.id}/${slugify(station.name)}`}
                        onClick={() => setOpen(false)}
                      >
                        {station.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {isLoading && <p>Suche läuft…</p>}
              {!isLoading && debouncedQuery && stations?.length === 0 && (
                <p>Keine Treffer.</p>
              )}
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Stationsname"
                className={styles.searchInput}
              />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
