"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { StationResource } from "@/lib/traewelling";
import ky from "ky";
import { useState } from "react";
import useSWR from "swr";

export function StationsSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: stations, isLoading } = useSWR(
    debouncedQuery
      ? `/api/stations/search?q=${encodeURIComponent(debouncedQuery)}`
      : null,
    (url: string) => ky.get(url).json<StationResource[]>(),
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Stationsname"
      />
      {isLoading && <p>Suche läuft…</p>}
      {!isLoading && debouncedQuery && stations?.length === 0 && (
        <p>Keine Treffer.</p>
      )}
      {stations && stations.length > 0 && (
        <ul>
          {stations.map((station) => (
            <li key={station.id}>{station.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
