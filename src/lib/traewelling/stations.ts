import type { TraewellingClient } from "./client";
import type { components, operations } from "./schema";

export type DepartureResource = components["schemas"]["DepartureResource"];
export type StationResource = components["schemas"]["StationResource"];
export type TravelType = components["schemas"]["TravelType"];

export async function autocompleteStation(
  client: TraewellingClient,
  query: string,
) {
  const sanitizedQuery = encodeURIComponent(query.replaceAll("/", " "));
  const { data } = await client
    .get(`v1/trains/station/autocomplete/${sanitizedQuery}`)
    .json<{ data: StationResource[] }>();

  return data;
}

export async function getDepartures(
  client: TraewellingClient,
  id: string,
  query?: operations["getDepartures"]["parameters"]["query"],
) {
  return client
    .get(`v1/station/${id}/departures`, { searchParams: query })
    .json<
      operations["getDepartures"]["responses"]["200"]["content"]["application/json"]
    >();
}

export async function getStation(
  client: TraewellingClient,
  id: string,
  query?: operations["showStation"]["parameters"]["query"],
) {
  const { data } = await client
    .get(`v1/stations/${id}`, { searchParams: query })
    .json<{ data: StationResource }>();

  return data;
}

export async function nearbyStations(
  client: TraewellingClient,
  latitude: number,
  longitude: number,
) {
  const { data } = await client
    .get("v1/trains/station/nearby", { searchParams: { latitude, longitude } })
    .json<{ data: StationResource[] }>();

  return data;
}

export async function removeHomeStation(client: TraewellingClient) {
  await client.delete("v1/station/home");
}

export async function searchStations(
  client: TraewellingClient,
  query?: operations["indexStation"]["parameters"]["query"],
) {
  const { data } = await client
    .get("v1/stations", { searchParams: query })
    .json<{ data: StationResource[] }>();

  return data;
}

export async function setHomeStation(client: TraewellingClient, id: string) {
  const { data } = await client
    .put(`v1/station/${id}/home`)
    .json<{ data: StationResource }>();

  return data;
}

export async function stationHistory(client: TraewellingClient) {
  const { data } = await client
    .get("v1/trains/station/history")
    .json<{ data: StationResource[] }>();

  return data;
}
